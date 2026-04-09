-- ============================================================================
-- SafetyScore — Esquema de Base de Datos (Supabase PostgreSQL)
-- ============================================================================
-- Este esquema mapea las entidades detectadas en los archivos .md del proyecto:
--   CONTEXT.md, STITCH_PROMPT.md, PROMPT_SOY_INVERSIONISTA.md,
--   PROMPT_SOY_NEGOCIO.md, STITCH_PROMPT_PYME.md
--
-- Ejecutar en: Supabase SQL Editor
-- Proyecto: dlawmduvestckatdzmvr
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES: Extiende Supabase Auth con datos de rol
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT.md (Pantalla 2): Registro con selector de rol
--   "Soy un Negocio" / "Soy un Inversionista" → role
--   nessie_customer_id y nessie_account_id vinculan con API Nessie

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('pyme', 'investor')),
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  nessie_customer_id TEXT,
  nessie_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────────────────
-- BUSINESSES: Perfil financiero de la PyME
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT.md (Pantalla 3-4): Dashboard PYME + Wizard de Solicitud
--   Wizard Paso 1: name, sector, location_city, location_state, years_operating, employees
--   Wizard Paso 2: daily_sales, fixed_costs, variable_costs, has_debts, debt_amount
--   Safety Score + sub-métricas: STITCH_PROMPT.md (Pantalla 6)
--   trust_layer_analysis: Dictamen IA (STITCH_PROMPT.md Pantalla 6)

CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector TEXT NOT NULL DEFAULT 'Otro',
  location_city TEXT NOT NULL DEFAULT '',
  location_state TEXT NOT NULL DEFAULT '',
  years_operating INT DEFAULT 0,
  employees INT DEFAULT 1,
  daily_sales NUMERIC(12, 2) DEFAULT 0,
  fixed_costs NUMERIC(12, 2) DEFAULT 0,
  variable_costs NUMERIC(12, 2) DEFAULT 0,
  has_debts BOOLEAN DEFAULT false,
  debt_amount NUMERIC(12, 2) DEFAULT 0,
  safety_score INT CHECK (safety_score BETWEEN 0 AND 100),
  safety_sub_cashflow INT CHECK (safety_sub_cashflow BETWEEN 0 AND 100),
  safety_sub_sector INT CHECK (safety_sub_sector BETWEEN 0 AND 100),
  safety_sub_consistency INT CHECK (safety_sub_consistency BETWEEN 0 AND 100),
  safety_sub_return_probability INT CHECK (safety_sub_return_probability BETWEEN 0 AND 100),
  trust_layer_analysis TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'evaluating', 'scored', 'published', 'funded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- PyMEs ven solo su propio negocio
CREATE POLICY "Owners can manage own business"
  ON public.businesses FOR ALL
  USING (auth.uid() = owner_id);

-- Inversionistas ven negocios publicados (para el Marketplace)
CREATE POLICY "Investors can view published businesses"
  ON public.businesses FOR SELECT
  USING (status = 'published' OR status = 'funded');


-- ─────────────────────────────────────────────────────────────────────────────
-- OPPORTUNITIES: Campañas de inversión (el corazón del Marketplace)
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT.md (Pantalla 5): Grid de oportunidades del marketplace
--     Columnas: Nombre | Sector | SafetyScore | Monto | ROI | Estatus
--   STITCH_PROMPT.md (Pantalla 6): Panel lateral con CTA "Invertir"
--   PROMPT_SOY_INVERSIONISTA.md (Pantalla 1): Data Grid del Screener
--   funded_percentage es un campo calculado (GENERATED ALWAYS)

CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  requested_amount NUMERIC(12, 2) NOT NULL,
  funded_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  expected_roi NUMERIC(5, 2) NOT NULL DEFAULT 0,
  term_months INT NOT NULL DEFAULT 6,
  fund_destination TEXT DEFAULT 'Capital de Trabajo',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'funded', 'active', 'completed')),
  funded_percentage NUMERIC(5, 1) GENERATED ALWAYS AS (
    CASE WHEN requested_amount > 0
      THEN ROUND((funded_amount / requested_amount) * 100, 1)
      ELSE 0
    END
  ) STORED,
  marketplace_status TEXT NOT NULL DEFAULT 'new'
    CHECK (marketplace_status IN ('new', 'high-demand', 'last-day')),
  published_at TIMESTAMPTZ DEFAULT now(),
  closes_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Cualquiera autenticado puede ver oportunidades abiertas
CREATE POLICY "Anyone can view open opportunities"
  ON public.opportunities FOR SELECT
  USING (status = 'open' OR status = 'active');

-- Solo el dueño del negocio puede crear oportunidades
CREATE POLICY "Business owner can create opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- Permitir updates para fondeo (service role o triggers)
CREATE POLICY "Allow funding updates"
  ON public.opportunities FOR UPDATE
  USING (true);


-- ─────────────────────────────────────────────────────────────────────────────
-- INVESTMENTS: Registro de capital inyectado por inversionistas
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT.md (Pantalla 7): Portafolio del Inversionista
--     Tabla: Negocio | Monto Invertido | ROI | Estado | Próximo Pago
--   PROMPT_SOY_INVERSIONISTA.md (Pantalla 3): Portafolio Administrador
--     KPIs: Total AUM, Retorno Acumulado, Inversiones Activas
--   nessie_transfer_id vincula con la transferencia en API Nessie

CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  nessie_transfer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'payment-due', 'overdue', 'completed')),
  next_payment_date DATE,
  monthly_payment NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Inversionistas ven solo sus propias inversiones
CREATE POLICY "Investors can view own investments"
  ON public.investments FOR SELECT
  USING (auth.uid() = investor_id);

-- Inversionistas pueden crear nuevas inversiones
CREATE POLICY "Investors can create investments"
  ON public.investments FOR INSERT
  WITH CHECK (auth.uid() = investor_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- OPPORTUNITY_VIEWS: Tracking de visitas del inversionista
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT_PYME.md (Dashboard): "Ver mis visitas" (cuántos inversionistas han visto)
--   Alimenta la notificación "Un inversionista acaba de revisar tu prospecto"

CREATE TABLE IF NOT EXISTS public.opportunity_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunity_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can track views"
  ON public.opportunity_views FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Owners can see views on their opportunities"
  ON public.opportunity_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.businesses b ON o.business_id = b.id
      WHERE o.id = opportunity_id
      AND b.owner_id = auth.uid()
    )
    OR auth.uid() = investor_id
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- NOTIFICATIONS: Feed de actividad en tiempo real
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT.md (Dashboard PyME - Actividad Reciente):
--     "Hace 2h — La IA completó tu evaluación de riesgo."
--     "Hace 1d — Tu solicitud fue recibida."
--   STITCH_PROMPT.md (Portafolio Inversionista - Alertas):
--     "Nueva oportunidad en tu zona con ROI > 20%"
--     "Pago recibido de Abarrotes Doña María: $8,500 MXN"

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'info'
    CHECK (type IN ('info', 'success', 'warning', 'payment')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- ENABLE REALTIME (para notificationService.ts)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ─────────────────────────────────────────────────────────────────────────────
-- FUNCIÓN: Auto-crear perfil al registrarse
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'pyme'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: cuando se registra un usuario, crear su perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
