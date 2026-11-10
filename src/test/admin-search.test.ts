import { describe, expect, it, vi, beforeEach } from "vitest";
import { adminSearchSchema, searchPattern } from "@/lib/admin-search";

const { context } = vi.hoisted(() => ({ context: { userId: "admin", supabase: { rpc: vi.fn(), from: vi.fn() } } }));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: {} }));
vi.mock("@tanstack/react-start", () => ({ createServerFn: () => {
  let validator: (v: unknown) => unknown;
  const builder = { middleware: () => builder, inputValidator: (v: typeof validator) => { validator = v; return builder; }, handler: (h: (v: unknown) => unknown) => (input: { data: unknown }) => h({ context, data: validator(input.data) }) };
  return builder;
} }));
import { searchAdminRecords } from "@/lib/admin-search.functions";

describe("admin global search", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it("rejects anonymous/non-admin record access before any table query", async () => {
    context.supabase.rpc.mockResolvedValue({ data: false, error: null });
    await expect(searchAdminRecords({ data: { query: "Dan" } })).rejects.toThrow("Forbidden");
    expect(context.supabase.from).not.toHaveBeenCalled();
  });
  it("searches all requested record categories under the caller's RLS client", async () => {
    context.supabase.rpc.mockResolvedValue({ data: true, error: null });
    context.supabase.from.mockImplementation((table: string) => {
      const builder = { select: vi.fn(() => builder), or: vi.fn(() => builder), order: vi.fn(() => builder), limit: vi.fn(async () => ({ data: table === "clinic_payments" ? [{ id: "p1", provider: "stripe", provider_payment_id: "ref-53", amount_minor: 5300, currency: "USD", paid_at: "2026-11-10" }] : [], error: null })) };
      return builder;
    });
    const results = await searchAdminRecords({ data: { query: "stripe" } });
    expect(context.supabase.from.mock.calls.map(([table]) => table)).toEqual(["clinic_enquiries", "clinic_payments", "payment_proofs", "client_reviews"]);
    expect(results[0]).toMatchObject({ type: "payment", status: "Provider-confirmed", details: { amount: 5300, reference: "ref-53" } });
  });
  it("matches wildcard and filter punctuation literally", () => {
    expect(searchPattern('50%_ off, "sale"')).toBe('"%50\\%\\_ off, \\"sale\\"%"');
    expect(searchPattern("a\\b")).toBe('"%a\\\\b%"');
  });
  it("rejects empty and oversized search terms", () => {
    expect(adminSearchSchema.safeParse({ query: " " }).success).toBe(false);
    expect(adminSearchSchema.safeParse({ query: "a".repeat(121) }).success).toBe(false);
    expect(adminSearchSchema.parse({ query: " Dan " }).query).toBe("Dan");
  });
});