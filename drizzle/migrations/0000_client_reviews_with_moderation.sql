CREATE TABLE public.client_reviews (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 role text NOT NULL DEFAULT '',
 rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
 body text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','hidden')),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.client_reviews TO anon;
GRANT SELECT, UPDATE ON public.client_reviews TO authenticated;
GRANT ALL ON public.client_reviews TO service_role;
ALTER TABLE public.client_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors read published reviews" ON public.client_reviews FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins read all reviews" ON public.client_reviews FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins moderate reviews" ON public.client_reviews FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE INDEX client_reviews_status_created_idx ON public.client_reviews(status, created_at DESC);