import { createFileRoute } from "@tanstack/react-router";
import { flutterwaveClinicPayment, safeEqual } from "@/lib/payment-confirmations";

export const Route = createFileRoute("/api/public/payments/flutterwave")({
  server: { handlers: { POST: async ({ request }) => {
    const secret = process.env["FLUTTERWAVE_WEBHOOK_HASH"];
    if (!secret) return new Response("Not configured", { status: 503 });
    if (!safeEqual(request.headers.get("verif-hash") ?? "", secret)) return new Response("Invalid signature", { status: 401 });
    const body = await request.text();
    if (body.length > 1_000_000) return new Response("Too large", { status: 413 });
    let event: unknown;
    try { event = JSON.parse(body); } catch { return new Response("Invalid payload", { status: 400 }); }
    const payment = flutterwaveClinicPayment(event);
    if (payment) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("clinic_payments").upsert(payment, { onConflict: "provider,provider_payment_id", ignoreDuplicates: true });
      if (error) { console.error("Flutterwave payment save failed", error.message); return new Response("Save failed", { status: 500 }); }
    }
    return new Response("ok");
  } } },
});