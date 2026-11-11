import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
const { submitEnquiry } = vi.hoisted(() => ({ submitEnquiry: vi.fn() }));
vi.mock("@/lib/enquiries.functions", () => ({ submitEnquiry }));
import { useEnquiry } from "@/components/form-bits";
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it("submits mentorship contact, role and goal without a mentorship-reason answer", async () => {
  submitEnquiry.mockResolvedValue({});
  const form = document.createElement("form");
  for (const [name, value] of Object.entries({ name: "Test Mentee", email: "mentee@example.com", phone: "+2348000000000", role: "Consultant", goal: "Win consistent clients" })) {
    const input = document.createElement("input"); input.name = name; input.value = value; form.append(input);
  }
  const { result } = renderHook(() => useEnquiry("mentorship"));
  await act(async () => { await result.current.save(form); });
  expect(submitEnquiry).toHaveBeenCalledWith({ data: { kind: "mentorship", name: "Test Mentee", email: "mentee@example.com", whatsapp: "+2348000000000", details: { role: "Consultant", goal: "Win consistent clients" } } });
});