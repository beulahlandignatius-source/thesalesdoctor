import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/lib/audit";
import { answerMascotMood } from "@/lib/mascot-state";

describe("mascot reactions do not invent findings", () => {
  it("celebrates only an explicitly strong self-reported scale answer", () => {
    const question = QUESTIONS.find(q => q.id === "q6");
    if (!question || question.type !== "scale") throw new Error("Missing market question");
    expect(answerMascotMood(question, question.options[4] ?? "")).toBe("positive");
    expect(answerMascotMood(question, question.options[0] ?? "")).toBe("examining");
    expect(answerMascotMood(question, "")).toBe("examining");
    expect(answerMascotMood(question, "unrecognized answer")).toBe("examining");
  });
  it("never infers strengths from text, choice answers, or missing questions", () => {
    expect(answerMascotMood(QUESTIONS[0] ?? null, "Our business is great")).toBe("examining");
    const question = QUESTIONS.find(q => q.id === "q4");
    expect(answerMascotMood(question ?? null, "$10,000+")).toBe("examining");
    expect(answerMascotMood(null, "")).toBe("examining");
  });
});