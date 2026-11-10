import { createFileRoute } from "@tanstack/react-router";
import { stripeClinicPayment, verifyStripeSignature } from "@/lib/payment-confirmations";

export const Route = createFileRoute("/api/public/payments/stripe")({
  server: { handlers: { POST: async ({ request }) => {
    const secret = process.env["STRIPE_CLINIC_WEBHOOK_SECRET"];
    if (!secret) return new Response("Not configured", { status: 503 });
    const body = await request.text();
    if (body.length > 1_000_000 || !(await verifyStripeSignature(body, request.headers.get("stripe-signature"), secret))) return new Response("Invalid signature", { status: 401 });
    let event: unknown;
    try { event = JSON.parse(body); } catch { return new Response("Invalid payload", { status: 400 }); }
    const payment = stripeClinicPayment(event);
    if (payment) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("clinic_payments").upsert(payment, { onConflict: "provider,provider_payment_id", ignoreDuplicates: true });
      if (error) { console.error("Stripe payment save failed", error.message); return new Response("Save failed", { status: 500 }); }
    }
    return new Response("ok");
  } } },
});