// Verifies the caller's session token; exposes context.supabase (RLS as the user) and userId.
export { requireSupabaseAuth as requireBackendAuth } from "@/integrations/supabase/auth-middleware";
