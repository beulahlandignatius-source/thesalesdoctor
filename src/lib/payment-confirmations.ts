export type ConfirmedPayment = { provider: "stripe" | "flutterwave"; provider_payment_id: string; amount_minor: number; currency: string; paid_at: string };

const encoder = new TextEncoder();

export function safeEqual(a: string, b: string) {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

async function hmacHex(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return [...new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyStripeSignature(body: string, header: string | null, secret: string, now = Date.now()) {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.split("="));
  const timestamp = parts.find(([k]) => k === "t")?.[1];
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v ?? "");
  if (!timestamp || !/^\d+$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300) return false;
  const expected = await hmacHex(secret, `${timestamp}.${body}`);
  return signatures.some((s) => safeEqual(s, expected));
}

export function stripeClinicPayment(event: any): ConfirmedPayment | null {
  const s = event?.data?.object;
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event?.type) || s?.payment_status !== "paid") return null;
  if (s.amount_total !== 5300 || String(s.currency).toLowerCase() !== "usd" || typeof s.id !== "string") return null;
  return { provider: "stripe", provider_payment_id: s.id, amount_minor: 5300, currency: "USD", paid_at: new Date((event.created ?? Date.now() / 1000) * 1000).toISOString() };
}

export function flutterwaveClinicPayment(event: any): ConfirmedPayment | null {
  const d = event?.data;
  const type = event?.event ?? event?.type;
  if (type !== "charge.completed" || String(d?.status).toLowerCase() !== "successful" || String(d?.currency).toUpperCase() !== "NGN") return null;
  const amount = Math.round(Number(d.amount) * 100);
  if (!Number.isFinite(amount) || amount <= 0 || d.id == null) return null;
  const paid = new Date(d.created_at ?? Date.now());
  return { provider: "flutterwave", provider_payment_id: String(d.id), amount_minor: amount, currency: "NGN", paid_at: Number.isNaN(paid.getTime()) ? new Date().toISOString() : paid.toISOString() };
}