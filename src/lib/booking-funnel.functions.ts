import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Public: insert-only booking funnel step (no personal data). */
export const logBookingStep = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ session: z.enum(["free_review", "private_clinic"]), step: z.enum(["viewed", "started", "completed"]) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("booking_funnel_events").insert(data);
    return { ok: true };
  });
