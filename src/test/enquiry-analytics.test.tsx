import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { submitEnquiry } = vi.hoisted(() => ({ submitEnquiry: vi.fn() }));
vi.mock("@/lib/enquiries.functions", () => ({ submitEnquiry }));
import { useEnquiry } from "@/components/form-bits";

afterEach(() => { cleanup(); vi.clearAllMocks(); delete window.__lovableEvents; });
describe("free consultation analytics", () => {
  it("tracks one free consultation only after its details save", async () => {
    const track = vi.fn();
    window.__lovableEvents = { track };
    submitEnquiry.mockResolvedValue({});
    const { result } = renderHook(() => useEnquiry("free_review"));
    await act(async () => { await result.current.save(document.createElement("form")); });
    expect(track).toHaveBeenCalledExactlyOnceWith("project.enquiry_submitted", { kind: "free_review" });
  });
  it("does not count failed submissions", async () => {
    const track = vi.fn();
    window.__lovableEvents = { track };
    submitEnquiry.mockRejectedValue(new Error("Save failed"));
    const { result } = renderHook(() => useEnquiry("free_review"));
    await act(async () => { await result.current.save(document.createElement("form")); });
    expect(track).not.toHaveBeenCalled();
  });
});