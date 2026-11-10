import { describe, it, expect } from "vitest";
import { saveViewSchema, viewFilters, renameViewSchema } from "@/lib/saved-views";

describe("saved admin filter definitions", () => {
  it("preserves enquiry search, type, status and exact date range", () => {
    const filters = { q: "Ada", kind: "free_review", status: "new", from: "2026-11-01", to: "2026-11-10" };
    expect(saveViewSchema.parse({ scope: "enquiries", name: " New reviews ", filters })).toEqual({ scope: "enquiries", name: "New reviews", filters });
  });
  it("preserves payment status and provider", () => {
    expect(viewFilters.parse({ status: "pending", provider: "stripe" })).toEqual({ status: "pending", provider: "stripe" });
  });
  it("does not store individual record IDs or returned records", () => {
    expect(viewFilters.parse({ record: "private-id", rows: [{ name: "Client" }], status: "new" })).toEqual({ status: "new" });
  });
  it("rejects reversed, incomplete or invalid dates", () => {
    expect(viewFilters.safeParse({ from: "2026-11-10", to: "2026-11-01" }).success).toBe(false);
    expect(viewFilters.safeParse({ from: "2026-11-10" }).success).toBe(false);
    expect(viewFilters.safeParse({ from: "2026-02-30", to: "2026-03-01" }).success).toBe(false);
  });
  it("requires nonempty names and valid rename IDs", () => {
    expect(saveViewSchema.safeParse({ scope: "payments", name: " ", filters: {} }).success).toBe(false);
    expect(renameViewSchema.safeParse({ id: "bad", name: "Stripe" }).success).toBe(false);
  });
});