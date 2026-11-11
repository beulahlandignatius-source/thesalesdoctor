import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/lib/audit";
import { AUDIT_PAGES, pageForStep, stepForPage, pageAnswersValid } from "@/lib/audit-pages";
describe("Six topic stages", () => {
  it("has six pages and preserves every existing question exactly once", () => {
    expect(AUDIT_PAGES).toHaveLength(6);
    const ids = AUDIT_PAGES.flatMap(p => p.ids);
    expect(ids).toHaveLength(29);
    expect(new Set(ids).size).toBe(29);
    expect([...ids].sort()).toEqual(QUESTIONS.map(q => q.id).sort());
  });
  it("keeps related questions together", () => {
    expect(AUDIT_PAGES[2]?.ids).toEqual(["q9", "q10", "q11", "q12", "q13", "q14"]);
    expect(AUDIT_PAGES[3]?.ids).toEqual(["q16", "q17", "q18", "q19"]);
    expect(AUDIT_PAGES[4]?.ids).toEqual(["q15", "q20", "q21", "q22", "q23", "q24", "q25", "q26"]);
  });
  it("maps legacy saved question steps to the matching topic", () => {
    expect(pageForStep(0)).toBe(0);
    expect(pageForStep(15)).toBe(4);
    expect(pageForStep(29)).toBe(5);
    AUDIT_PAGES.forEach((_, page) => expect(pageForStep(stepForPage(page))).toBe(page));
  });
  it("requires all topic answers while leaving the original optional numbers optional", () => {
    expect(pageAnswersValid(5, { q4: "Under $250", q5: "1–2" })).toBe(true);
    expect(pageAnswersValid(5, { q4: "Under $250" })).toBe(false);
    expect(pageAnswersValid(1, { q1: "Consulting" })).toBe(false);
  });
});