CREATE TABLE public.booking_funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session text NOT NULL CHECK (session IN ('free_review','private_clinic')),
  step text NOT NULL CHECK (step IN ('viewed','started','completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.booking_funnel_events TO authenticated;
GRANT ALL ON public.booking_funnel_events TO service_role;
ALTER TABLE public.booking_funnel_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read booking funnel" ON public.booking_funnel_events FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE INDEX booking_funnel_events_created_idx ON public.booking_funnel_events (created_at);