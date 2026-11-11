import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ start: vi.fn(), save: vi.fn(), navigate: vi.fn(), get: vi.fn() }));
vi.mock("@tanstack/react-router", async (original) => ({ ...await original<typeof import("@tanstack/react-router")>(), useNavigate: () => mocks.navigate, Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span> }));
vi.mock("@/lib/audit-session.functions", () => ({ startAuditSession: mocks.start, saveAuditAnswer: mocks.save, getAuditSession: mocks.get, updateAuditInfo: vi.fn() }));
vi.mock("@/components/diagnostic-guide", () => ({ DiagnosticGuide: () => null, DiagnosticSweep: () => null }));
import { Audit } from "@/routes/audit";
import { QUESTIONS } from "@/lib/audit";
beforeEach(() => { localStorage.clear(); window.scrollTo = vi.fn(); mocks.start.mockResolvedValue({ id: "test", token: "test" }); mocks.save.mockResolvedValue({}); });
afterEach(() => { cleanup(); vi.resetAllMocks(); delete window.__lovableEvents; });
describe("X-Ray form analytics", () => {
  it("counts first contact edit once without collecting contact values", () => {
    const track = vi.fn(); window.__lovableEvents = { track }; render(<Audit />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "test@example.com" } });
    expect(track).toHaveBeenCalledExactlyOnceWith("project.xray_form_started", {});
  });
  it("tracks invalid email and short phone blur using category-only properties", () => {
    const track = vi.fn(); window.__lovableEvents = { track }; render(<Audit />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "invalid" } });
    fireEvent.blur(screen.getByLabelText("Email address"));
    fireEvent.change(screen.getByLabelText("WhatsApp number"), { target: { value: "123" } });
    fireEvent.blur(screen.getByLabelText("WhatsApp number"));
    expect(track).toHaveBeenCalledWith("project.xray_validation_error", { stage: "contact", field: "email", reason: "invalid_format" });
    expect(track).toHaveBeenCalledWith("project.xray_validation_error", { stage: "contact", field: "whatsapp", reason: "invalid_format" });
  });
  it.each([true, false])("counts final submission only when every answer saves: %s", async (success) => {
    localStorage.setItem("client-xray-v2", JSON.stringify({ step: QUESTIONS.length, session: { id: "test", token: "test" }, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers: { q1: "Service", q4: "Under $250", q5: "1–2", q29: "$0" } }));
    mocks.get.mockResolvedValue({ completed: false, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers: {}, step: QUESTIONS.length });
    if (!success) mocks.save.mockRejectedValue(new Error("offline"));
    const track = vi.fn(); window.__lovableEvents = { track }; render(<Audit />);
    await waitFor(() => expect(screen.getByRole("button", { name: "See my X-Ray" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "See my X-Ray" }));
    await waitFor(() => expect(mocks.save).toHaveBeenCalled());
    if (success) {
      await waitFor(() => expect(track).toHaveBeenCalledExactlyOnceWith("project.xray_form_submitted", {}));
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/results" });
    } else {
      await screen.findByRole("alert"); expect(track).not.toHaveBeenCalled(); expect(mocks.navigate).not.toHaveBeenCalled();
    }
  });
});