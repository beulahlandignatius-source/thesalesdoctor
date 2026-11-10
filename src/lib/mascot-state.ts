import type { Question } from "@/lib/audit";

// Reactions acknowledge self-reported answers, never produce a diagnosis.
export function answerMascotMood(question: Question | null, answer: string): "examining" | "positive" {
  if (!question || question.type !== "scale") return "examining";
  const index = question.options.indexOf(answer);
  return index >= 3 ? "positive" : "examining";
}