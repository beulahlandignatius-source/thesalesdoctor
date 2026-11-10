CREATE TABLE public.payment_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('stripe','flutterwave')),
  file_path text NOT NULL,
  content_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.payment_proofs TO authenticated;
GRANT ALL ON public.payment_proofs TO service_role;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read payment proofs" ON public.payment_proofs FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins review payment proofs" ON public.payment_proofs FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));