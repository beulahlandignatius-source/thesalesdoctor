import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ start: vi.fn(), save: vi.fn(), navigate: vi.fn(), get: vi.fn(), submit: vi.fn() }));
vi.mock("@tanstack/react-router", async (original) => ({ ...await original<typeof import("@tanstack/react-router")>(), useNavigate: () => mocks.navigate, Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span> }));
vi.mock("@/lib/audit-session.functions", () => ({ startAuditSession: mocks.start, saveAuditAnswers: mocks.save, getAuditSession: mocks.get, updateAuditInfo: vi.fn(), submitAuditForReview: mocks.submit }));
vi.mock("@/components/xray-submission-modal", () => ({ XraySubmissionModal: () => <div role="dialog">Receipt</div> }));
vi.mock("@/components/diagnostic-guide", () => ({ DiagnosticGuide: () => null, DiagnosticSweep: () => null }));
import { Audit } from "@/routes/audit";
import { QUESTIONS } from "@/lib/audit";
beforeEach(() => { localStorage.clear(); window.scrollTo = vi.fn(); mocks.start.mockResolvedValue({ id: "test", token: "test" }); mocks.save.mockResolvedValue({}); mocks.submit.mockResolvedValue({ submitted: true }); });
afterEach(() => { cleanup(); vi.resetAllMocks(); delete window.__lovableEvents; });
describe("X-Ray form analytics", () => {
  it("advances from contact immediately while session creation is still pending", async () => {
    let resolve: (value: { id: string; token: string }) => void = () => {};
    mocks.start.mockReturnValue(new Promise(r => { resolve = r; }));
    render(<Audit />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("WhatsApp number"), { target: { value: "123456789" } });
    fireEvent.click(screen.getByRole("button", { name: "Next stage" }));
    expect(screen.getByText("What do you currently sell?")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("client-xray-v2") ?? "{}").step).toBe(1);
    expect(screen.queryByText("Saving…")).toBeNull();
    resolve({ id: "test", token: "test" });
    await waitFor(() => expect(JSON.parse(localStorage.getItem("client-xray-v2") ?? "{}").session.id).toBe("test"));
  });
  it("advances to the next topic before its answers finish saving", async () => {
    const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, q.type === "text" ? "Test" : q.options[0]]));
    localStorage.setItem("client-xray-v2", JSON.stringify({ step: 1, session: { id: "test", token: "test" }, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers }));
    mocks.get.mockResolvedValue({ completed: false, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers, step: 1 });
    let resolve: () => void = () => {};
    mocks.save.mockReturnValue(new Promise<void>(r => { resolve = r; }));
    render(<Audit />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Next stage" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Next stage" }));
    expect(screen.getByText("If someone visits your profile/page today, how quickly would they understand what you do?")).toBeInTheDocument();
    expect(screen.queryByText("Saving…")).toBeNull();
    await waitFor(() => expect(mocks.save).toHaveBeenCalledOnce());
    resolve();
  });
  it("preserves saved answers when reconnecting fails", async () => {
    localStorage.setItem("client-xray-v2", JSON.stringify({ step: 1, session: { id: "test", token: "test" }, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers: { q1: "Consulting" } }));
    mocks.get.mockRejectedValue(new Error("offline"));
    render(<Audit />);
    await screen.findByRole("alert");
    expect(JSON.parse(localStorage.getItem("client-xray-v2") ?? "{}").answers.q1).toBe("Consulting");
  });
  it("takes an already submitted session to its completion page without replaying the scanner", async () => {
    localStorage.setItem("client-xray-v2", JSON.stringify({ step: 29, session: { id: "test", token: "test" }, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers: {} }));
    mocks.get.mockResolvedValue({ completed: true });
    render(<Audit />);
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith({ to: "/results", replace: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
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
      expect(mocks.submit).toHaveBeenCalledOnce();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(mocks.navigate).not.toHaveBeenCalled();
    } else {
      await screen.findByRole("alert"); expect(track).not.toHaveBeenCalled(); expect(mocks.navigate).not.toHaveBeenCalled(); expect(screen.queryByRole("dialog")).toBeNull();
    }
  });
  it("does not show scanning when server confirmation fails", async () => {
    localStorage.setItem("client-xray-v2", JSON.stringify({ step: 29, session: { id: "test", token: "test" }, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers: { q4: "Under $250", q5: "1–2" } }));
    mocks.get.mockResolvedValue({ completed: false, info: { name: "Test", email: "test@example.com", whatsapp: "123456789" }, answers: {}, step: 29 });
    mocks.submit.mockRejectedValue(new Error("Incomplete assessment"));
    const track = vi.fn(); window.__lovableEvents = { track }; render(<Audit />);
    await waitFor(() => expect(screen.getByRole("button", { name: "See my X-Ray" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "See my X-Ray" }));
    await screen.findByRole("alert");
    expect(screen.queryByRole("dialog")).toBeNull(); expect(track).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem("client-xray-v2") ?? "{}").answers.q4).toBe("Under $250");
  });
});