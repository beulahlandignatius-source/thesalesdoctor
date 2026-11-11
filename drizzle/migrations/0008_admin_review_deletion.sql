GRANT DELETE ON public.client_reviews TO authenticated;
CREATE POLICY "Admins delete reviews" ON public.client_reviews FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));