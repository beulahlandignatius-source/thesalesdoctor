CREATE TABLE public.admin_saved_views (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL DEFAULT auth.uid(),
 scope text NOT NULL CHECK (scope IN ('enquiries', 'payments')),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
 filters jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (user_id, scope, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_saved_views TO authenticated;
GRANT ALL ON public.admin_saved_views TO service_role;
ALTER TABLE public.admin_saved_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own saved views" ON public.admin_saved_views FOR ALL TO authenticated USING (user_id = auth.uid() AND public.is_admin(auth.uid())) WITH CHECK (user_id = auth.uid() AND public.is_admin(auth.uid()));
CREATE INDEX admin_saved_views_owner_scope ON public.admin_saved_views(user_id, scope);