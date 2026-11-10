CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = _user_id)
$$;

CREATE POLICY "Admins see own admin row" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.audit_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token_hash text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  current_step integer NOT NULL DEFAULT 0,
  booked boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  confidence numeric,
  diagnosis_title text,
  primary_diagnosis text,
  severity text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_sessions TO authenticated;
GRANT ALL ON public.audit_sessions TO service_role;
ALTER TABLE public.audit_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit sessions" ON public.audit_sessions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.audit_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer text NOT NULL,
  score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, question_id)
);
GRANT SELECT ON public.audit_answers TO authenticated;
GRANT ALL ON public.audit_answers TO service_role;
ALTER TABLE public.audit_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit answers" ON public.audit_answers FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.audit_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
  diagnosis text NOT NULL,
  diagnosis_title text NOT NULL,
  severity text NOT NULL,
  confidence numeric NOT NULL,
  one_sentence_diagnosis text NOT NULL,
  business_impact text NOT NULL,
  secondary_observation text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  market_score numeric,
  positioning_score numeric,
  offer_score numeric,
  lead_generation_score numeric,
  sales_score numeric,
  follow_up_score numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_results TO authenticated;
GRANT ALL ON public.audit_results TO service_role;
ALTER TABLE public.audit_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit results" ON public.audit_results FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.clinic_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.clinic_enquiries TO authenticated;
GRANT ALL ON public.clinic_enquiries TO service_role;
ALTER TABLE public.clinic_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read enquiries" ON public.clinic_enquiries FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update enquiries" ON public.clinic_enquiries FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
