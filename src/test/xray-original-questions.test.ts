import { describe, expect, it } from "vitest";
import { QUESTIONS, OPTIONAL_IDS, calculateScores } from "@/lib/audit";
import { AUDIT_PAGES } from "@/lib/audit-pages";

describe("Original Thesalesdoctor assessment contract", () => {
  it("keeps exactly 29 business questions and three optional numbers in six stages", () => {
    expect(QUESTIONS).toHaveLength(29);
    expect([...OPTIONAL_IDS]).toEqual(["q27", "q28", "q29"]);
    expect(AUDIT_PAGES).toHaveLength(6);
    expect(new Set(AUDIT_PAGES.flatMap(p => p.ids)).size).toBe(29);
  });
  it("preserves original scale answer scoring instead of inventing findings", () => {
    const answers = Object.fromEntries(QUESTIONS.filter(q => q.type === "scale").map(q => [q.id, q.type === "scale" ? q.options[4] ?? "" : ""]));
    expect(calculateScores(answers)).toEqual({ market: 100, positioning: 100, offer: 100, leadgen: 100, sales: 100, followup: 100 });
  });
});