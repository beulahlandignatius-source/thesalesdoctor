import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", async original => ({ ...await original<typeof import("@tanstack/react-router")>(), Link: ({ search, children }: { search: { purpose: string }; children: React.ReactNode }) => <a href={`/xray/book?purpose=${search.purpose}`}>{children}</a> }));
import { XrayComplete } from "@/routes/xray.complete";
import { buildBookingUrl } from "@/lib/booking";
import { CALL_PURPOSES } from "@/lib/xray-booking";
afterEach(cleanup);
describe("Post-X-Ray call booking", () => {
  it("requires a purpose before allowing Calendly booking", () => {
    render(<XrayComplete />);
    fireEvent.click(screen.getByRole("button", { name: "Book a call" }));
    expect(screen.getByRole("button", { name: "Continue to Calendly" })).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: "Turn attention into clients" }));
    expect(screen.getByRole("link", { name: "Continue to Calendly" })).toHaveAttribute("href", "/xray/book?purpose=conversion");
  });
  it.each(CALL_PURPOSES)("passes the selected purpose $label to the real Calendly link", ({ label }) => {
    const url = new URL(buildBookingUrl({ name: "Test", email: "test@example.com", business: "Consulting", diagnosis: "", severity: "", purpose: label }) ?? "");
    expect(url.origin + url.pathname).toBe("https://calendly.com/thesalesdoctor2/thesalesclinic");
    expect(url.searchParams.get("a2")).toBe(label);
    expect(url.searchParams.get("name")).toBe("Test");
  });
});