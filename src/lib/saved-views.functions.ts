import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { viewScope, viewFilters, saveViewSchema, renameViewSchema } from "./saved-views";

export const listSavedViews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ scope: viewScope }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase.from("admin_saved_views").select("id,name,filters").eq("user_id", context.userId).eq("scope", data.scope).order("created_at");
    if (error) throw new Error("Could not load saved views");
    return (rows ?? []).flatMap((row) => {
      const parsed = viewFilters.safeParse(row.filters);
      return parsed.success ? [{ id: row.id, name: row.name, filters: parsed.data }] : [];
    });
  });
export const saveView = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => saveViewSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("admin_saved_views").insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.code === "23505" ? "A view with this name already exists." : "Could not save this view.");
    return { ok: true };
  });
export const renameView = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => renameViewSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase.from("admin_saved_views").update({ name: data.name }).eq("id", data.id).eq("user_id", context.userId).select("id").single();
    if (error || !row) throw new Error(error?.code === "23505" ? "A view with this name already exists." : "Could not rename this view.");
    return { ok: true };
  });
export const deleteView = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase.from("admin_saved_views").delete().eq("id", data.id).eq("user_id", context.userId).select("id").single();
    if (error || !row) throw new Error("Could not delete this view.");
    return { ok: true };
  });