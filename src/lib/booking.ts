/**
 * BOOKING CONFIGURATION — update BOOKING_URL once the booking link is ready.
 * Audit details are appended as URL parameters (Calendly-style names work out of the box).
 */
export const BOOKING_URL = "https://calendly.com/thesalesdoctor2/thesalesclinic";

export function buildBookingUrl(d: { name: string; email: string; business: string; diagnosis: string; severity: string; purpose?: string | undefined }) {
  if (!BOOKING_URL) return null;
  const u = new URL(BOOKING_URL);
  u.searchParams.set("name", d.name);
  u.searchParams.set("email", d.email);
  u.searchParams.set("a1", d.business);
  u.searchParams.set("a2", d.purpose ?? d.diagnosis);
  u.searchParams.set("a3", d.severity);
  if (d.purpose) u.searchParams.set("utm_content", d.purpose);
  u.searchParams.set("utm_source", "client-xray");
  return u.toString();
}
