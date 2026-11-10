import { describe, expect, it } from "vitest";
import { GUIDE_QUESTIONS, respondToMessage, summarizeGuide } from "@/lib/sales-companion";

describe("three-question sales guidance", () => {
  it("requires all three answers and preserves the requested questions", () => {
    expect(GUIDE_QUESTIONS).toHaveLength(3);
    expect(summarizeGuide(["Getting customers", "Startups"])).toBeNull();
    expect(summarizeGuide(["Getting customers", "Startups", ""])).toBeNull();
  });
  it("routes the mentorship goal to the existing mentorship journey", () => {
    expect(summarizeGuide(["Getting customers", "Startups", "Get expert mentorship"])?.destination).toBe("/mentorship");
  });
  it("routes conversion challenges to the free review", () => {
    expect(summarizeGuide(["Closing sales", "Individuals", "Improve conversions"])?.destination).toBe("/book/free");
  });
  it("routes a sales system goal to the private working session", () => {
    expect(summarizeGuide(["Building a sales strategy", "Small businesses", "Build a sales system"])?.destination).toBe("/book/clinic");
  });
  it("uses the existing $53, 90-minute and free 25-minute offers", () => {
    const response = respondToMessage("What does a session cost?").text;
    expect(response).toContain("$53"); expect(response).toContain("90-minute"); expect(response).toContain("25-minute");
  });
  it("provides honest predefined fallback and never pretends to be AI", () => {
    expect(respondToMessage("Write my business plan").text).toContain("predefined guidance");
  });
});