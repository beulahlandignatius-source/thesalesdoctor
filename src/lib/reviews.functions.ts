import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { reviewSchema } from "./reviews";

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("client_reviews").insert({ name: data.name, role: data.role, rating: data.rating, body: data.body, status: "pending" });
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
  const { data, error } = await sb.from("client_reviews").select("id,name,role,rating,body").eq("status", "published").order("created_at", { ascending: false }).limit(100);
  if (error) throw new Error("Reviews are unavailable.");
  return data as Array<{ id: string; name: string; role: string; rating: number; body: string }>;
});

export const adminReviews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: allowed, error: authError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
  if (authError || !allowed) throw new Error("Forbidden");
  const { data, error } = await context.supabase.from("client_reviews").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) throw new Error("Couldn’t load reviews.");
  return data;
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