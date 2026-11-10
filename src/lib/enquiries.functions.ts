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
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("clinic_enquiries")
      .select("id, kind, name, email, whatsapp, details, status, created_at")
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

export const adminOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const sb = context.supabase;
    const count = async (q: any) => (await q).count ?? 0;
    const now = new Date();
    const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    const paid = (provider: string) => count(sb.from("clinic_payments").select("id", { count: "exact", head: true }).eq("provider", provider).gte("paid_at", month));
    const [free, clinic, mentor, newOnes, xrays, booked, stripePaid, flutterwavePaid] = await Promise.all([
      count(sb.from("clinic_enquiries").select("id", { count: "exact", head: true }).eq("kind", "free_review")),
      count(sb.from("clinic_enquiries").select("id", { count: "exact", head: true }).eq("kind", "private_clinic")),
      count(sb.from("clinic_enquiries").select("id", { count: "exact", head: true }).eq("kind", "mentorship")),
      count(sb.from("clinic_enquiries").select("id", { count: "exact", head: true }).eq("status", "new")),
      count(sb.from("audit_sessions").select("id", { count: "exact", head: true }).not("completed_at", "is", null)),
      count(sb.from("audit_sessions").select("id", { count: "exact", head: true }).eq("booked", true)),
      paid("stripe"),
      paid("flutterwave"),
    ]);
    const { data: funnelRows } = await sb.from("booking_funnel_events").select("session, step").gte("created_at", month).limit(10000);
    const funnel = { free_review: { viewed: 0, started: 0, completed: 0 }, private_clinic: { viewed: 0, started: 0, completed: 0 } } as Record<string, Record<string, number>>;
    for (const r of funnelRows ?? []) if (funnel[r.session] && r.step in funnel[r.session]!) funnel[r.session]![r.step]!++;
    const { data: recent } = await sb
      .from("clinic_enquiries")
      .select("id, kind, name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    const since = new Date(Date.now() - 14 * 864e5).toISOString();
    const [{ data: enqDates }, { data: xrayDates }, startedXrays] = await Promise.all([
      sb.from("clinic_enquiries").select("created_at").gte("created_at", since).limit(5000),
      sb.from("audit_sessions").select("completed_at").gte("completed_at", since).limit(5000),
      count(sb.from("audit_sessions").select("id", { count: "exact", head: true })),
    ]);
    return { free, clinic, mentor, newOnes, xrays, booked, stripePaid, flutterwavePaid, funnel, recent: recent ?? [], startedXrays,
      trend: { enquiries: (enqDates ?? []).map((r) => r.created_at as string), xrays: (xrayDates ?? []).map((r) => r.completed_at as string | null) } };
  });
