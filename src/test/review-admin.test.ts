import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({ createServerFn: () => {
  const builder = { middleware: () => builder, inputValidator: () => builder, handler: (fn: unknown) => fn };
  return builder;
} }));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: {} }));
import { deleteReview, editReview } from "@/lib/reviews.functions";

describe("administrator review permissions", () => {
  const from = vi.fn();
  const rpc = vi.fn();
  beforeEach(() => { vi.clearAllMocks(); });
  const context = { userId: "admin", supabase: { rpc, from } };
  it("denies deletion for a signed-in non-administrator", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    await expect((deleteReview as unknown as Function)({ context, data: { id: "review" } })).rejects.toThrow("Forbidden");
    expect(from).not.toHaveBeenCalled();
  });
  it("denies editing for a signed-in non-administrator", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    await expect((editReview as unknown as Function)({ context, data: { id: "review", name: "Client" } })).rejects.toThrow("Forbidden");
    expect(from).not.toHaveBeenCalled();
  });
  it("deletes only the selected review for a verified administrator", async () => {
    rpc.mockResolvedValue({ data: true, error: null });
    const eq = vi.fn().mockReturnValue({ select: () => ({ single: async () => ({ data: { id: "selected" }, error: null }) }) });
    from.mockReturnValue({ delete: () => ({ eq }) });
    await (deleteReview as unknown as Function)({ context, data: { id: "selected" } });
    expect(eq).toHaveBeenCalledWith("id", "selected");
  });
});