CREATE TABLE public.site_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'text' CHECK (kind IN ('text','image')),
  original text NOT NULL,
  replacement text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, original)
);
GRANT SELECT ON public.site_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_overrides TO authenticated;
GRANT ALL ON public.site_overrides TO service_role;
ALTER TABLE public.site_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads site overrides" ON public.site_overrides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert overrides" ON public.site_overrides FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update overrides" ON public.site_overrides FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete overrides" ON public.site_overrides FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Anyone views site media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-media');
CREATE POLICY "Admins upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.is_admin(auth.uid()));