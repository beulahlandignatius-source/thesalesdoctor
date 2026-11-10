CREATE TABLE public.clinic_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('stripe', 'flutterwave')),
  provider_payment_id text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency text NOT NULL,
  paid_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_payment_id)
);
GRANT SELECT ON public.clinic_payments TO authenticated;
GRANT ALL ON public.clinic_payments TO service_role;
ALTER TABLE public.clinic_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read confirmed clinic payments" ON public.clinic_payments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE INDEX clinic_payments_paid_at_idx ON public.clinic_payments (paid_at DESC);