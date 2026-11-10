import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "application/pdf"] as const;

/** Public: a visitor uploads a payment screenshot. Upload-only; nothing is read back. Not proof of payment. */
export const uploadPaymentProof = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(200),
      provider: z.enum(["stripe", "flutterwave"]),
      contentType: z.enum(TYPES),
      base64: z.string().min(10).max(7_000_000),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bytes.length > 5 * 1024 * 1024) throw new Error("File is larger than 5MB");
    const ext = (data.contentType.split("/")[1] ?? "bin").replace("jpeg", "jpg");
    const safe = data.email.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
    const path = `${new Date().toISOString().slice(0, 10)}/${safe}-${data.provider}-${crypto.randomUUID()}.${ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("payment-proofs").upload(path, bytes, { contentType: data.contentType });
    if (error) throw new Error("Could not upload your screenshot");
    const { error: rowError } = await supabaseAdmin.from("payment_proofs").insert({ name: data.name, email: data.email, provider: data.provider, file_path: path, content_type: data.contentType });
    if (rowError) throw new Error("Could not save your screenshot");
    return { ok: true };
  });

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("is_admin", { _user_id: ctx.userId });
  if (!data) throw new Error("Forbidden");
}

/** Admin: list uploaded screenshots with short-lived view links. Uploads are NOT confirmed payments. */
export const listPaymentProofs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ record: z.string().uuid().optional() }).parse(d ?? {}))
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context);
    let query = context.supabase.from("payment_proofs")
      .select("id, name, email, provider, file_path, content_type, status, reviewed_at, created_at");
    if (input.record) query = query.eq("id", input.record);
    const { data, error } = await query
      .order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error("Could not load payment screenshots");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return Promise.all((data ?? []).map(async (r: any) => {
      const { data: s } = await supabaseAdmin.storage.from("payment-proofs").createSignedUrl(r.file_path, 600);
      return { ...r, url: s?.signedUrl ?? null };
    }));
  });

export const reviewPaymentProof = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: z.enum(["pending", "verified", "rejected"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("payment_proofs")
      .update({ status: data.status, reviewed_at: data.status === "pending" ? null : new Date().toISOString() }).eq("id", data.id);
    if (error) throw new Error("Could not update");
    return { ok: true };
  });
