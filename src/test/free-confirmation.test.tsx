import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const { save } = vi.hoisted(() => ({ save: vi.fn() }));
vi.mock("@/components/form-bits", () => ({
  FormShell: ({ children }: { children: ReactNode }) => <>{children}</>,
  F: ({ children }: { children: ReactNode }) => <>{children}</>,
  FormError: () => null, Options: () => null, StuckPicker: () => null,
  field: "", privacy: null, useEnquiry: () => ({ save, busy: false, error: "" }),
}));
vi.mock("@/components/site", () => ({
  btnClass: () => "",
  ExtLink: ({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) => <a href={href} onClick={onClick}>{children}</a>,
}));
import { Free } from "@/routes/book.free";

afterEach(() => { cleanup(); vi.clearAllMocks(); delete window.__lovableEvents; });
describe("free consultation submission", () => {
  it("tracks the WhatsApp next step once per click, not on confirmation display", async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    const track = vi.fn();
    window.__lovableEvents = { track };
    save.mockResolvedValue({ name: "Test client", email: "test@example.com" });
    const { container } = render(<Free />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form missing");
    fireEvent.submit(form);
    const link = await screen.findByRole("link");
    expect(track).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(track).toHaveBeenCalledExactlyOnceWith("project.consultation_whatsapp_clicked", { session: "free_review" });
  });
  it("offers the existing WhatsApp destination only after the details save successfully", async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    save.mockResolvedValue({ name: "Test client", email: "test@example.com" });
    const { container } = render(<Free />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form missing");
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole("link")).toHaveAttribute("href", "https://wa.link/ez0syb"));
    expect(container.querySelector("form")).toBeNull();
  });
  it("keeps the form and does not offer the next step when saving fails", async () => {
    save.mockResolvedValue(null);
    const { container } = render(<Free />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form missing");
    fireEvent.submit(form);
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    expect(container.querySelector("form")).toBe(form);
    expect(screen.queryByRole("link")).toBeNull();
  });
});