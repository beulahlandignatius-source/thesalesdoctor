import { describe, expect, it } from "vitest";
import { CLINIC_BONUSES, CLINIC_BONUS_VALUE } from "../lib/clinic-bonuses";
import { CLINIC_PRICE } from "../lib/links";

describe("Private Sales Clinic included bonuses", () => {
  it("includes exactly five bonuses", () => expect(CLINIC_BONUSES).toHaveLength(5));
  it("values the Profile Prescription at $5", () => expect(CLINIC_BONUSES[0].price).toBe(5));
  it("values the content plan at $5", () => expect(CLINIC_BONUSES[1].price).toBe(5));
  it("values the pitch template at $7", () => expect(CLINIC_BONUSES[2].price).toBe(7));
  it("values the offer worksheet at $10", () => expect(CLINIC_BONUSES[3].price).toBe(10));
  it("does not invent a price for VIP-only follow-ups", () => expect(CLINIC_BONUSES[4].price).toBeNull());
  it("totals the priced bonuses at $27", () => expect(CLINIC_BONUS_VALUE).toBe(27));
  it("keeps the inclusive session price at $53", () => expect(CLINIC_PRICE).toBe("$53"));
});