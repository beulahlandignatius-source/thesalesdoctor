import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ from: vi.fn(), answers: {} as Record<string, string>, tokenHash: "", completed: null as string | null, update: vi.fn(), writeError: null as null | { message: string } }));
vi.mock("@tanstack/react-start", () => ({ createServerFn: () => { const b = { inputValidator: () => b, handler: (fn: unknown) => fn }; return b; } }));
vi.mock("@/lib/backend/admin.server", () => ({ backendAdmin: () => ({ from: mocks.from }) }));
import { submitAuditForReview, saveAuditAnswer } from "@/lib/audit-session.functions";
import { QUESTIONS, OPTIONAL_IDS } from "@/lib/audit";
beforeEach(async () => {
  vi.clearAllMocks(); mocks.completed = null; mocks.writeError = null;
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("test-token"));
  mocks.tokenHash = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
  mocks.answers = Object.fromEntries(QUESTIONS.filter(q => !OPTIONAL_IDS.has(q.id)).map(q => [q.id, q.type === "text" ? "Answer" : q.options[0] ?? ""]));
  mocks.from.mockImplementation((table: string) => {
    const b = { select: () => b, eq: () => b, maybeSingle: async () => ({ data: { access_token_hash: mocks.tokenHash, completed_at: mocks.completed } }), update: (data: unknown) => { mocks.update(data); return b; }, upsert: () => b, delete: () => b, then: (resolve: (value: unknown) => void) => resolve({ data: table === "audit_answers" ? Object.entries(mocks.answers).map(([question_id, answer]) => ({ question_id, answer })) : null, error: mocks.writeError }) };
    return b;
  });
});
describe("Verified X-Ray submission", () => {
  it("confirms only complete stored answers and marks the existing session received", async () => {
    await expect((submitAuditForReview as unknown as Function)({ data: { id: "session", token: "test-token" } })).resolves.toEqual({ submitted: true });
    expect(mocks.update).toHaveBeenCalledWith({ completed_at: expect.any(String) });
    expect(mocks.from.mock.calls.every(([table]) => table !== "audit_results")).toBe(true);
  });
  it("rejects incomplete answers without marking completion", async () => {
    delete mocks.answers['q1'];
    await expect((submitAuditForReview as unknown as Function)({ data: { id: "session", token: "test-token" } })).rejects.toThrow("Incomplete assessment");
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("rejects an invalid session token", async () => {
    await expect((submitAuditForReview as unknown as Function)({ data: { id: "session", token: "wrong" } })).rejects.toThrow("Session not found");
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("repeated confirmation does not overwrite the submission date", async () => {
    mocks.completed = "2026-11-11T18:00:00Z";
    await (submitAuditForReview as unknown as Function)({ data: { id: "session", token: "test-token" } });
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("fails saving when the answer write is rejected", async () => {
    mocks.writeError = { message: "write failed" };
    await expect((saveAuditAnswer as unknown as Function)({ data: { id: "session", token: "test-token", questionId: "q1", answer: "Service", step: 1 } })).rejects.toThrow("Could not save answer");
  });
});