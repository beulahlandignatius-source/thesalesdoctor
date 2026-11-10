import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { BACKEND_URL, keyFetch } from "./config";

let _a: ReturnType<typeof make> | undefined;
function make() {
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!key) throw new Error("Backend service key is not configured");
  return createClient<Database>(BACKEND_URL, key, {
    global: { fetch: keyFetch(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}
/** Privileged client — bypasses RLS. Server only. */
export function backendAdmin() {
  if (!_a) _a = make();
  return _a;
}
