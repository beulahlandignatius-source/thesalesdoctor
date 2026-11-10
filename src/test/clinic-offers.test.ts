import { describe, expect, it } from "vitest";
import { CLINIC_PRICE, LINKS, calendlyUrl } from "@/lib/links";

describe("Preserved Sales Clinic offers and destinations", () => {
  it("keeps the Private Sales Clinic at $53", () => {
    expect(CLINIC_PRICE).toBe("$53");
  });
  it("keeps the exact USD Stripe destination", () => {
    expect(LINKS.stripe).toBe("https://buy.stripe.com/9B600lb5Vgslcake8y2ZO0L");
  });
  it("keeps the exact NGN Flutterwave destination", () => {
    expect(LINKS.flutterwave).toBe("https://flutterwave.com/pay/kyqfrin1z57j");
  });
  it("keeps the exact consultation booking destination", () => {
    expect(calendlyUrl()).toBe("https://calendly.com/thesalesdoctor2/thesalesclinic");
  });
  it("keeps the exact mentorship WhatsApp destination", () => {
    expect(LINKS.whatsapp).toBe("https://wa.link/ez0syb");
  });
  it("preserves booking prefills without changing its destination", () => {
    const url = new URL(calendlyUrl("Clinic QA", "clinic-qa@example.com"));
    expect(url.origin + url.pathname).toBe(LINKS.calendly);
    expect(url.searchParams.get("name")).toBe("Clinic QA");
    expect(url.searchParams.get("email")).toBe("clinic-qa@example.com");
  });
});