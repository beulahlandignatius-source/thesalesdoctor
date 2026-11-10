import { describe, expect, it } from "vitest";
import { flutterwaveClinicPayment, stripeClinicPayment, verifyStripeSignature } from "@/lib/payment-confirmations";

async function sign(body: string, t: number) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode("test-secret"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = [...new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${body}`)))].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `t=${t},v1=${sig}`;
}

describe("Confirmed Private Sales Clinic payments", () => {
  it("accepts only correctly signed Stripe events", async () => {
    const body = "{}";
    expect(await verifyStripeSignature(body, await sign(body, 1_000), "test-secret", 1_000_000)).toBe(true);
    expect(await verifyStripeSignature("{\"x\":1}", await sign(body, 1_000), "test-secret", 1_000_000)).toBe(false);
  });
  it("counts a paid $53 Stripe checkout", () => {
    expect(stripeClinicPayment({ type: "checkout.session.completed", created: 1, data: { object: { id: "cs_1", payment_status: "paid", amount_total: 5300, currency: "usd" } } })?.amount_minor).toBe(5300);
    expect(stripeClinicPayment({ type: "checkout.session.completed", data: { object: { id: "cs_2", payment_status: "paid", amount_total: 5000, currency: "usd" } } })).toBeNull();
  });
  it("counts successful NGN Flutterwave charges only", () => {
    expect(flutterwaveClinicPayment({ event: "charge.completed", data: { id: 7, status: "successful", currency: "NGN", amount: 80000 } })?.amount_minor).toBe(8_000_000);
    expect(flutterwaveClinicPayment({ event: "charge.completed", data: { id: 8, status: "failed", currency: "NGN", amount: 80000 } })).toBeNull();
  });
});