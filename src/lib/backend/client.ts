import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { BACKEND_PUBLISHABLE_KEY, BACKEND_URL, keyFetch } from "./config";

function make() {
  return createClient<Database>(BACKEND_URL, BACKEND_PUBLISHABLE_KEY, {
    global: { fetch: keyFetch(BACKEND_PUBLISHABLE_KEY) },
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
    },
  });
}

let _c: ReturnType<typeof make> | undefined;
/** Browser client (admin sign-in). RLS applies. */
export const backend = new Proxy({} as ReturnType<typeof make>, {
  get(_, p, r) {
    if (!_c) _c = make();
    return Reflect.get(_c, p, r);
  },
});
