import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireBackendAuth as requireSupabaseAuth } from "@/lib/backend/auth";

// All reads go through the caller's own client, so RLS (is_admin) is the gate.
async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("is_admin", { _user_id: ctx.userId });
  if (!data) throw new Error("Forbidden");
}

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    return { isAdmin: !!data };
  });

export const listAudits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: sessions, error } = await context.supabase
      .from("audit_sessions")
      .select("id, name, email, completed_at, primary_diagnosis, diagnosis_title, severity, booked")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });
    if (error) throw new Error("Could not load audits");
    const ids = sessions.map((s) => s.id);
    const { data: sells } = ids.length
      ? await context.supabase.from("audit_answers").select("session_id, answer").eq("question_id", "q1").in("session_id", ids)
      : { data: [] as { session_id: string; answer: string }[] };
    const m = new Map((sells ?? []).map((r) => [r.session_id, r.answer]));
    return sessions.map((s) => ({ ...s, sells: m.get(s.id) ?? "" }));
  });

export const getAuditDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    const [{ data: session }, { data: answers }, { data: result }] = await Promise.all([
      sb.from("audit_sessions").select("id, name, email, phone, created_at, completed_at, primary_diagnosis, diagnosis_title, severity, confidence, booked").eq("id", data.id).maybeSingle(),
      sb.from("audit_answers").select("question_id, answer, score").eq("session_id", data.id),
      sb.from("audit_results").select("*").eq("session_id", data.id).maybeSingle(),
    ]);
    if (!session) throw new Error("Not found");
    return { session, answers: answers ?? [], result };
  });
