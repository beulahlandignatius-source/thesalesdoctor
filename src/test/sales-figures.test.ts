import { describe, expect, it } from "vitest";
import { SALES_CLOSED_USD } from "@/lib/sales-figures";

describe("approved sales figure", () => {
  it("uses the owner's updated 135k sales total", () => {
    expect(SALES_CLOSED_USD).toBe(135_000);
  });
});