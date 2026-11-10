import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ENQUIRY_KINDS = ["free_review", "private_clinic", "mentorship"] as const;
export const ENQUIRY_STATUSES = ["new", "contacted", "booked", "paid", "closed"] as const;

const str = (max: number) => z.string().trim().max(max);

const enquirySchema = z.object({
  kind: z.enum(ENQUIRY_KINDS),
  name: str(120).min(1),
  email: z.string().trim().email().max(200),
  whatsapp: str(40).min(3),
  details: z.record(z.string(), z.union([str(2000), z.array(str(200)).max(20)])).default({}),
});

/** Public: visitors submit a Sales Clinic form. Only inserts; never returns stored data. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => enquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("clinic_enquiries").insert(data);
    if (error) throw new Error("Could not save your details");
    return { ok: true };
  });

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("is_admin", { _user_id: ctx.userId });
  if (!data) throw new Error("Forbidden");
}

export const listEnquiries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ record: z.string().uuid().optional() }).parse(d ?? {}))
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context);
    let query = context.supabase
      .from("clinic_enquiries")
      .select("id, kind, name, email, whatsapp, details, status, created_at");
    if (input.record) query = query.eq("id", input.record);
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error("Could not load enquiries");
    return data as Array<{ id: string; kind: string; name: string; email: string; whatsapp: string; details: Record<string, string | string[]>; status: string; created_at: string }>;
  });

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: z.enum(ENQUIRY_STATUSES) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("clinic_enquiries").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Could not update");
    return { ok: true };
  });

/** Admin overview for a date range plus the equal-length period before it, so the dashboard can compare. */
export const adminOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { previousRange, isoBounds } = await import("@/lib/date-range");
    const sb = context.supabase;
    const { gte } = isoBounds(previousRange(data)), { lt } = isoBounds(data);
    const [enq, started, done, funnel, paid, recent] = await Promise.all([
      sb.from("clinic_enquiries").select("kind, status, created_at").gte("created_at", gte).lt("created_at", lt).limit(10000),
      sb.from("audit_sessions").select("created_at").gte("created_at", gte).lt("created_at", lt).limit(10000),
      sb.from("audit_sessions").select("completed_at, booked").gte("completed_at", gte).lt("completed_at", lt).limit(10000),
      sb.from("booking_funnel_events").select("session, step, created_at").gte("created_at", gte).lt("created_at", lt).limit(20000),
      sb.from("clinic_payments").select("provider, paid_at").gte("paid_at", gte).lt("paid_at", lt).limit(10000),
      sb.from("clinic_enquiries").select("id, kind, name, status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);
    if (enq.error || started.error || done.error) throw new Error("Could not load overview");
    return {
      enquiries: (enq.data ?? []) as { kind: string; status: string; created_at: string }[],
      started: (started.data ?? []).map((r: { created_at: string }) => r.created_at),
      completed: (done.data ?? []) as { completed_at: string; booked: boolean }[],
      funnel: (funnel.data ?? []) as { session: string; step: string; created_at: string }[],
      payments: (paid.data ?? []) as { provider: string; paid_at: string }[],
      recent: (recent.data ?? []) as { id: string; kind: string; name: string; status: string; created_at: string }[],
    };
  });
