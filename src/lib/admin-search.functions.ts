import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { adminSearchSchema, searchPattern, type AdminSearchResult } from "./admin-search";
import { z } from "zod";

export const searchAdminRecords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => adminSearchSchema.parse(input))
  .handler(async ({ context, data }): Promise<AdminSearchResult[]> => {
    const { data: allowed, error: authError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (authError || !allowed) throw new Error("Forbidden");
    const pattern = searchPattern(data.query);
    const filter = (fields: string[]) => [
      ...fields.map((f) => `${f}.ilike.${pattern}`),
      ...(z.string().uuid().safeParse(data.query).success ? [`id.eq.${data.query}`] : []),
    ].join(",");
    const [enquiries, payments, screenshots, reviews] = await Promise.all([
      context.supabase.from("clinic_enquiries").select("id,name,email,whatsapp,kind,status,created_at").or(filter(["name", "email", "whatsapp", "kind", "status"])).order("created_at", { ascending: false }).limit(10),
      context.supabase.from("clinic_payments").select("id,provider,provider_payment_id,amount_minor,currency,paid_at").or(filter(["provider", "provider_payment_id", "currency"])).order("paid_at", { ascending: false }).limit(10),
      context.supabase.from("payment_proofs").select("id,name,email,provider,status,created_at").or(filter(["name", "email", "provider", "status"])).order("created_at", { ascending: false }).limit(10),
      context.supabase.from("client_reviews").select("id,name,role,body,status,created_at").or(filter(["name", "role", "body", "status"])).order("created_at", { ascending: false }).limit(10),
    ]);
    if ([enquiries, payments, screenshots, reviews].some((r) => r.error)) throw new Error("Could not search records");
    return [
      ...(enquiries.data ?? []).map((r): AdminSearchResult => ({ id: r.id, type: "enquiry", title: r.name, subtitle: `${r.email} · ${r.whatsapp}`, status: r.status, date: r.created_at })),
      ...(payments.data ?? []).map((r): AdminSearchResult => ({ id: r.id, type: "payment", title: `${r.provider} · ${r.currency} ${(r.amount_minor / 100).toFixed(2)}`, subtitle: r.provider_payment_id, status: "Provider-confirmed", date: r.paid_at, details: { reference: r.provider_payment_id, provider: r.provider, amount: r.amount_minor, currency: r.currency } })),
      ...(screenshots.data ?? []).map((r): AdminSearchResult => ({ id: r.id, type: "screenshot", title: r.name, subtitle: `${r.email} · ${r.provider}`, status: r.status, date: r.created_at })),
      ...(reviews.data ?? []).map((r): AdminSearchResult => ({ id: r.id, type: "review", title: r.name, subtitle: `${r.role} · ${r.body.slice(0, 160)}`, status: r.status, date: r.created_at })),
    ];
  });