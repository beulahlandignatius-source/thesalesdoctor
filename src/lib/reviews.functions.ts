import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { adminReviewEditSchema, reviewSubmitSchema } from "./reviews";
import { existingTestimonials } from "./existing-reviews";

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSubmitSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const upload = async (f: { base64: string; contentType: string } | null, kind: string) => {
      if (!f) return null;
      const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
      if (bytes.length > 5 * 1024 * 1024) throw new Error("Images must be under 5MB.");
      const path = `${kind}/${crypto.randomUUID()}.${f.contentType.split("/")[1]}`;
      const { error } = await supabaseAdmin.storage.from("review-media").upload(path, bytes, { contentType: f.contentType });
      if (error) throw new Error("Your image couldn’t be uploaded.");
      return path;
    };
    const photo_path = await upload(data.photo, "photos");
    const screenshot_path = await upload(data.screenshot, "screenshots");
    const { error } = await supabaseAdmin.from("client_reviews").insert({ name: data.name, role: data.role, rating: data.rating, body: data.body, status: "pending", photo_path, screenshot_path });
    if (error) throw new Error("Your review couldn’t be saved. Please try again.");
    return { ok: true };
  });

export const publicReviews = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("Reviews are unavailable.");
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  } } });
  const { data, error } = await sb.from("client_reviews").select("id,name,role,rating,body,photo_path,screenshot_path,source_key").eq("status", "published").order("created_at", { ascending: false }).limit(100);
  if (error) throw new Error("Reviews are unavailable.");
  return signMedia(data ?? []);
});

export const adminReviews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ record: z.string().uuid().optional() }).parse(d ?? {}))
  .handler(async ({ context, data: input }) => {
  const { data: allowed, error: authError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
  if (authError || !allowed) throw new Error("Forbidden");
  let query = context.supabase.from("client_reviews").select("*");
  if (input.record) query = query.eq("id", input.record);
  const { data, error } = await query.order("created_at", { ascending: false }).limit(1000);
  if (error) throw new Error("Couldn’t load reviews.");
  return signMedia(data ?? []);
});

export const moderateReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), status: z.enum(["published", "hidden", "pending"]) }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed, error: authError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (authError || !allowed) throw new Error("Forbidden");
    const { error } = await context.supabase.from("client_reviews").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Couldn’t update this review.");
    return { ok: true };
  });
async function signMedia<T extends { photo_path: string | null; screenshot_path: string | null }>(rows: T[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const paths = rows.flatMap((r) => [r.photo_path, r.screenshot_path]).filter((p): p is string => !!p);
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data } = await supabaseAdmin.storage.from("review-media").createSignedUrls(paths, 3600);
    for (const d of data ?? []) if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
  }
  return rows.map(({ photo_path, screenshot_path, ...r }) => {
    const sourceKey = "source_key" in r && typeof r.source_key === "string" ? r.source_key : "";
    const sample = existingTestimonials.find(([, name]) => `existing:${name}` === sourceKey);
    return { ...r, photoUrl: photo_path ? urls.get(photo_path) ?? null : sample?.[3] ?? null, screenshotUrl: screenshot_path ? urls.get(screenshot_path) ?? null : null };
  });
}

export const editReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => adminReviewEditSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed, error: authError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (authError || !allowed) throw new Error("Forbidden");
    const { id, ...changes } = data;
    const { data: row, error } = await context.supabase.from("client_reviews").update(changes).eq("id", id).select("id").single();
    if (error || !row) throw new Error("Couldn’t save this review.");
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed, error: authError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (authError || !allowed) throw new Error("Forbidden");
    const { data: row, error } = await context.supabase.from("client_reviews").delete().eq("id", data.id).select("id").single();
    if (error || !row) throw new Error("Couldn’t delete this review.");
    return { ok: true };
  });
