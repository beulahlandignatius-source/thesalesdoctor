import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { backend } from "./client";
import { BACKEND_PUBLISHABLE_KEY, BACKEND_URL, keyFetch } from "./config";

/** Client side: attach the signed-in admin's token to server function calls. */
export const attachBackendAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await backend.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});

/** Server side: verify the token and expose a caller-scoped client (RLS as the user). */
export const requireBackendAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const auth = getRequest()?.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = auth.slice(7);
  if (token.split(".").length !== 3) throw new Error("Unauthorized");
  const supabase = createClient<Database>(BACKEND_URL, BACKEND_PUBLISHABLE_KEY, {
    global: { fetch: keyFetch(BACKEND_PUBLISHABLE_KEY), headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Unauthorized");
  return next({ context: { supabase, userId: data.user.id } });
});
