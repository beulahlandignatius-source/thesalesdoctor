DROP POLICY IF EXISTS "Anyone reads site overrides" ON public.site_overrides;
CREATE POLICY "Admins read site overrides" ON public.site_overrides FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
REVOKE SELECT ON public.site_overrides FROM anon;
GRANT ALL ON public.site_overrides TO service_role;
DROP POLICY IF EXISTS "Anyone views site media" ON storage.objects;
CREATE POLICY "Admins view site media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-media' AND public.is_admin(auth.uid()));