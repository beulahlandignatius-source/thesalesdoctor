import { describe, expect, it } from "vitest";
import { isDiagnosisResult } from "@/lib/result-presentation";

describe("saved diagnosis recovery", () => {
  it("rejects damaged or incomplete cache objects", () => {
    expect(isDiagnosisResult(null)).toBe(false);
    expect(isDiagnosisResult({ diagnosis_title: "Incomplete" })).toBe(false);
    expect(isDiagnosisResult({ primary_diagnosis: "unknown", evidence: [] })).toBe(false);
  });
  it("accepts a complete supported diagnosis", () => {
    const result = {
      primary_diagnosis: "empty_pipeline",
      diagnosis_title: "The Empty Pipeline",
      severity: "HIGH",
      one_sentence_diagnosis: "Few qualified buyers enter your pipeline.",
      evidence: ["Few buyer conversations."],
      business_impact: "Client growth is constrained.",
      secondary_observation: null,
    };
    expect(isDiagnosisResult(result)).toBe(true);
    expect(isDiagnosisResult({ ...result, evidence: [42] })).toBe(false);
  });
});
