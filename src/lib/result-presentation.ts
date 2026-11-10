export type DiagnosisResult = {
  primary_diagnosis: string;
  diagnosis_title: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  one_sentence_diagnosis: string;
  evidence: string[];
  business_impact: string;
  secondary_observation?: string | null;
};

export const MEANING: Record<string, string> = {
  empty_pipeline:
    "When too few qualified people enter your pipeline, every other part of your business has to work harder to make up for it. Good sales skills and a strong offer can't produce clients from conversations that never happen.",
  invisible_expert:
    "If people can't quickly see what makes you different, they compare you on price or simply move on. You may be getting attention without getting chosen.",
  weak_offer:
    "People can understand what you do and still not feel a strong enough reason to buy now. That means interest stays interest, and decisions keep getting delayed.",
  wrong_room:
    "Effort spent in front of people who are unlikely to buy feels like activity but rarely turns into clients. The work is happening, but in the wrong place.",
  leaking_sales_process:
    "You're already doing the hard part of getting people into conversations. When too many of those don't turn into clients, opportunities you've earned are slipping away.",
  lead_graveyard:
    "People who have already shown interest are the closest to buying. When they're left without a clear next step, many quietly go elsewhere or forget.",
};

const NO_DATA = "We don’t have enough data to put a reliable dollar value on this yet.";
export function costText(a: Record<string, string>, key: string) {
  const conv = a["q27"],
    closed = a["q28"],
    rev = a["q29"];
  const tracked = (v?: string) => v && v !== "I don't track this";
  if (!tracked(conv) || !tracked(closed) || !tracked(rev) || rev === "$0" || closed === "0")
    return NO_DATA;
  const lead =
    key === "leaking_sales_process" || key === "lead_graveyard"
      ? "Those are people you've already spent time and effort attracting."
      : "Each missed opportunity has a real value to your business.";
  return `Last month you had around ${conv} sales conversations and closed ${closed} client${closed === "1" ? "" : "s"}, bringing in ${rev}. That gives a sense of what each new client is worth to you. ${lead} Every client this problem keeps away is revenue at that level you aren't seeing.`;
}

export function isDiagnosisResult(value: unknown): value is DiagnosisResult {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r["primary_diagnosis"] === "string" &&
    r["primary_diagnosis"] in MEANING &&
    typeof r["diagnosis_title"] === "string" &&
    ["LOW", "MODERATE", "HIGH", "CRITICAL"].includes(String(r["severity"])) &&
    typeof r["one_sentence_diagnosis"] === "string" &&
    typeof r["business_impact"] === "string" &&
    Array.isArray(r["evidence"]) &&
    r["evidence"].every((e) => typeof e === "string") &&
    (r["secondary_observation"] == null || typeof r["secondary_observation"] === "string")
  );
}
