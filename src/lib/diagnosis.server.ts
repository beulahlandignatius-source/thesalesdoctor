import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";
import { QUESTIONS, type Category, type Scores } from "./audit";

export const DIAGNOSES = {
  empty_pipeline: { title: "The Empty Pipeline", category: "leadgen", meaning: "Not enough qualified prospects are entering the sales process." },
  invisible_expert: { title: "The Invisible Expert", category: "positioning", meaning: "Positioning is unclear or not differentiated enough." },
  weak_offer: { title: "The Weak Offer", category: "offer", meaning: "People understand what they do, but the offer is not creating enough buying desire." },
  wrong_room: { title: "The Wrong Room", category: "market", meaning: "They are reaching people who are unlikely to become clients." },
  leaking_sales_process: { title: "The Leaking Sales Process", category: "sales", meaning: "They have opportunities but lose too many during the sales process." },
  lead_graveyard: { title: "The Lead Graveyard", category: "followup", meaning: "Interested prospects are disappearing because follow-up is weak." },
} as const satisfies Record<string, { title: string; category: Category; meaning: string }>;

export type DiagnosisKey = keyof typeof DIAGNOSES;
export type Severity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
const KEYS = Object.keys(DIAGNOSES) as [DiagnosisKey, ...DiagnosisKey[]];

const aiSchema = z.object({
  primary_diagnosis: z.enum(KEYS),
  diagnosis_title: z.string(),
  confidence: z.number(),
  one_sentence_diagnosis: z.string(),
  evidence: z.array(z.string()),
  business_impact: z.string(),
  secondary_observation: z.string().nullable(),
});
export type AiDiagnosis = z.infer<typeof aiSchema>;

const LEVELS: Severity[] = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
const atLeast = (s: Severity, min: Severity) => (LEVELS.indexOf(s) < LEVELS.indexOf(min) ? min : s);

/** Deterministic severity — never chosen by AI. */
export function calculateSeverity(key: DiagnosisKey, scores: Scores, a: Record<string, string>): Severity {
  const score = scores[DIAGNOSES[key].category];
  let s: Severity = score == null ? "MODERATE" : score >= 70 ? "LOW" : score >= 50 ? "MODERATE" : score >= 30 ? "HIGH" : "CRITICAL";
  if (key === "empty_pipeline" && a["q17"] === "0–5") s = atLeast(s, "HIGH");
  if (key === "lead_graveyard" && ["A lot", "Honestly, I have no idea"].includes(a["q24"] ?? "")) s = atLeast(s, "HIGH");
  if (key === "leaking_sales_process" && ["11–25", "26–50", "50+"].includes(a["q27"] ?? "") && ["0", "1"].includes(a["q28"] ?? "")) s = atLeast(s, "HIGH");
  return s;
}

const INSTRUCTIONS = `You are the diagnostic engine for "The Client X-Ray", a client acquisition audit by Dr. Dan Odotukpono (The Sales Doctor).
Choose exactly ONE primary diagnosis from:
${KEYS.map((k) => `- ${k} ("${DIAGNOSES[k].title}"): ${DIAGNOSES[k].meaning}`).join("\n")}

Method:
- Start from the deterministic system scores (0–100, lower = weaker; null = not enough data). Default priority when evidence is close: Lead Generation, Positioning, Offer, Sales, Follow-up, Market.
- Do NOT blindly pick the lowest score. Weigh the actual answers and free text as evidence. Few buyer conversations → strongly consider empty_pipeline. People see the business but don't understand it → invisible_expert. They understand but don't see enough value → weak_offer. Attracting people unlikely to buy → wrong_room. Enough sales conversations but few closes → leaking_sales_process. Many interested people not followed up → lead_graveyard.
- "I don't track this" is neutral, never a negative.

Rules:
- Never calculate scores, severity or financial losses. Never invent numbers, statistics or revenue. Only reference numbers the user selected.
- Never give solutions, fixes, action plans, scripts, templates or motivational advice. Never guarantee results. Never shame.
- Exactly one primary diagnosis. diagnosis_title must be the title listed above for that key.
- evidence: exactly 3 short points, each citing the user's actual answers in plain language (second person, "you").
- confidence: 0 to 1.
- secondary_observation: one short sentence about another possible constraint, or null.
- Never use em dashes. Be specific, concise and personal; it should feel like an expert actually looked at this business.`;

export async function runDiagnosis(input: { info: { name: string }; answers: Record<string, string>; scores: Scores }): Promise<AiDiagnosis> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const qa = QUESTIONS.filter((q) => input.answers[q.id]).map((q) => `[${q.section}] ${q.text}\n→ ${input.answers[q.id]}`).join("\n\n");
  const prompt = `Name: ${input.info.name}\n\nSystem scores: ${JSON.stringify(input.scores)}\n\nAnswers:\n${qa}`;

  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const provider = createOpenAI({
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey,
        headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      });
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions: INSTRUCTIONS,
        messages: [{ role: "user", content: prompt }],
        output: Output.object({ schema: aiSchema }),
        maxRetries: 0,
        providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
      });
      let out: AiDiagnosis;
      try { out = await result.output; }
      catch { out = aiSchema.parse(JSON.parse(await result.text)); }
      const d = DIAGNOSES[out.primary_diagnosis];
      return {
        ...out,
        diagnosis_title: d.title,
        confidence: Math.min(1, Math.max(0, out.confidence)),
        evidence: out.evidence.filter(Boolean).slice(0, 3),
      };
    } catch (e) {
      lastErr = e;
      const status = (e as { statusCode?: number }).statusCode;
      if (status && status !== 429 && status < 500) break; // terminal (credits, denial, bad request)
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr;
}
