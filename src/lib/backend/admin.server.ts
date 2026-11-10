import { supabaseAdmin } from "@/integrations/supabase/client.server";
/** Privileged client — bypasses RLS. Server only. */
export function backendAdmin() {
  return supabaseAdmin;
}
