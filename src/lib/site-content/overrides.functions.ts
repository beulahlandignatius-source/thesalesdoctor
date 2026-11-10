import { createServerFn } from "@tanstack/react-start";

/** Public read of published site edits; returns only the fields pages need plus short-lived signed photo URLs. */
export const getSiteOverrides = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("site_overrides").select("kind, original, replacement").limit(2000);
  if (error) { console.error("site overrides read failed", error); return { rows: [], urls: {} as Record<string, string> }; }
  const rows = (data ?? []).map((r) => ({ kind: r.kind, original: r.original, replacement: r.replacement }));
  const paths = rows.filter((r) => r.kind === "image").map((r) => r.replacement);
  const urls: Record<string, string> = {};
  if (paths.length) {
    const { data: signed } = await supabaseAdmin.storage.from("site-media").createSignedUrls(paths, 60 * 60);
    signed?.forEach((s) => { if (s.path && s.signedUrl) urls[s.path] = s.signedUrl; });
  }
  return { rows, urls };
});
