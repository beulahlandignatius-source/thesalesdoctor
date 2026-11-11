import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Anonymous visitors hold a random access token for their own session; only its hash is stored.
const ref = z.object({ id: z.string().uuid(), token: z.string().min(32).max(128) });
const info = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(7).max(30),
});

async function sha256(t: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function verify(id: string, token: string) {
  const supabaseAdmin = (await import("@/lib/backend/admin.server")).backendAdmin();
  const { data } = await supabaseAdmin.from("audit_sessions").select("*").eq("id", id).maybeSingle();
  if (!data || data.access_token_hash !== (await sha256(token))) throw new Error("Session not found");
  return { db: supabaseAdmin, session: data };
}

export const startAuditSession = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ info }).parse(d))
  .handler(async ({ data }) => {
    const supabaseAdmin = (await import("@/lib/backend/admin.server")).backendAdmin();
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const { data: row, error } = await supabaseAdmin
      .from("audit_sessions")
      .insert({ access_token_hash: await sha256(token), name: data.info.name, email: data.info.email, phone: data.info.whatsapp })
      .select("id").single();
    if (error) throw new Error("Could not start audit");
    return { id: row.id, token };
  });

export const updateAuditInfo = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ref.extend({ info }).parse(d))
  .handler(async ({ data }) => {
    const { db, session } = await verify(data.id, data.token);
    if (session.completed_at) return { ok: true };
    const { error } = await db.from("audit_sessions").update({ name: data.info.name, email: data.info.email, phone: data.info.whatsapp }).eq("id", data.id);
    if (error) throw new Error("Could not save contact details");
    return { ok: true };
  });

export const saveAuditAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    ref.extend({ questionId: z.string().max(20), answer: z.string().max(1000), step: z.number().int().min(0).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const { db, session } = await verify(data.id, data.token);
    if (session.completed_at) return { ok: true };
    const { QUESTIONS } = await import("./audit");
    const q = QUESTIONS.find((x) => x.id === data.questionId);
    if (!q) throw new Error("Unknown question");
    if (data.answer !== "" && q.type !== "text") {
      const { MULTI_SEP } = await import("./audit");
      const parts = q.type === "choice" && q.multi ? data.answer.split(MULTI_SEP) : [data.answer];
      if (!parts.every((p) => q.options.includes(p))) throw new Error("Invalid answer");
    }
    const idx = q.type === "scale" ? q.options.indexOf(data.answer) : -1;
    if (data.answer === "") {
      const { error } = await db.from("audit_answers").delete().eq("session_id", data.id).eq("question_id", q.id);
      if (error) throw new Error("Could not save answer");
    } else {
      const { error } = await db.from("audit_answers").upsert(
        { session_id: data.id, question_id: q.id, answer: data.answer, score: idx >= 0 ? idx + 1 : null },
        { onConflict: "session_id,question_id" });
      if (error) throw new Error("Could not save answer");
    }
    const { error } = await db.from("audit_sessions").update({ current_step: data.step }).eq("id", data.id);
    if (error) throw new Error("Could not save progress");
    return { ok: true };
  });

async function loadAnswers(db: Awaited<ReturnType<typeof verify>>["db"], id: string) {
  const { data, error } = await db.from("audit_answers").select("question_id, answer").eq("session_id", id);
  if (error) throw new Error("Could not read saved answers");
  return Object.fromEntries((data ?? []).map((r) => [r.question_id, r.answer])) as Record<string, string>;
}

async function loadResult(db: Awaited<ReturnType<typeof verify>>["db"], id: string) {
  const { data } = await db.from("audit_results").select("diagnosis, diagnosis_title, severity, one_sentence_diagnosis, evidence, business_impact, secondary_observation").eq("session_id", id).maybeSingle();
  if (!data) return null;
  return {
    primary_diagnosis: data.diagnosis, diagnosis_title: data.diagnosis_title, severity: data.severity,
    one_sentence_diagnosis: data.one_sentence_diagnosis, evidence: data.evidence as string[],
    business_impact: data.business_impact, secondary_observation: data.secondary_observation,
  };
}

export const getAuditSession = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ref.parse(d))
  .handler(async ({ data }) => {
    const { db, session } = await verify(data.id, data.token);
    return {
      info: { name: session.name, email: session.email, whatsapp: session.phone },
      step: session.current_step,
      answers: await loadAnswers(db, data.id),
      completed: !!session.completed_at,
    };
  });

// Confirm stored answers without invoking the diagnosis engine. completed_at
// keeps human-review submissions visible in the existing protected admin list.
export const submitAuditForReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ref.parse(d))
  .handler(async ({ data }) => {
    const { db, session } = await verify(data.id, data.token);
    const answers = await loadAnswers(db, data.id);
    const { QUESTIONS, OPTIONAL_IDS } = await import("./audit");
    if (QUESTIONS.some(q => !OPTIONAL_IDS.has(q.id) && !answers[q.id]?.trim())) throw new Error("Incomplete assessment");
    if (!session.completed_at) {
      const { error } = await db.from("audit_sessions").update({ completed_at: new Date().toISOString() }).eq("id", data.id);
      if (error) throw new Error("Could not submit assessment");
    }
    return { submitted: true as const };
  });

export const completeAudit = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ref.parse(d))
  .handler(async ({ data }) => {
    try {
      const { db, session } = await verify(data.id, data.token);
      const existing = await loadResult(db, data.id);
      if (existing) return { ok: true as const, ...existing };
      const { calculateScores } = await import("./audit");
      const { runDiagnosis, calculateSeverity } = await import("./diagnosis.server");
      const answers = await loadAnswers(db, data.id);
      const { QUESTIONS, OPTIONAL_IDS } = await import("./audit");
      if (QUESTIONS.some((q) => !OPTIONAL_IDS.has(q.id) && !answers[q.id]?.trim())) return { ok: false as const, incomplete: true };
      const scores = calculateScores(answers); // always recomputed from stored answers
      const ai = await runDiagnosis({ info: { name: session.name }, answers, scores });
      const severity = calculateSeverity(ai.primary_diagnosis, scores, answers);
      const { error } = await db.from("audit_results").insert({
        session_id: data.id, diagnosis: ai.primary_diagnosis, diagnosis_title: ai.diagnosis_title, severity,
        confidence: ai.confidence, one_sentence_diagnosis: ai.one_sentence_diagnosis, evidence: ai.evidence,
        business_impact: ai.business_impact, secondary_observation: ai.secondary_observation,
        market_score: scores.market, positioning_score: scores.positioning, offer_score: scores.offer,
        lead_generation_score: scores.leadgen, sales_score: scores.sales, follow_up_score: scores.followup,
      });
      if (error) throw error;
      await db.from("audit_sessions").update({
        completed_at: session.completed_at ?? new Date().toISOString(), primary_diagnosis: ai.primary_diagnosis,
        diagnosis_title: ai.diagnosis_title, severity, confidence: ai.confidence,
      }).eq("id", data.id);
      const result = await loadResult(db, data.id);
      if (!result) throw new Error("Result not found");
      return { ok: true as const, ...result };
    } catch (e) {
      console.error("complete audit failed", e);
      return { ok: false as const };
    }
  });
