-- ============================================================================
-- SafetyScore — Datos Semilla (Mock Data Realista)
-- ============================================================================
-- Datos simulados para que el Marketplace y los Dashboards funcionen
-- desde el primer momento con información visualmente impactante.
--
-- Nombres de negocios mexicanos reales, montos en MXN, ciudades reales.
-- Estos datos se mapean 1:1 con los del archivo constants.ts existente.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- PERFILES DE DEMOSTRACIÓN
-- ─────────────────────────────────────────────────────────────────────────────
-- Nota: Estos se insertan como perfiles huérfanos (sin auth.users asociado)
-- para propósitos de demostración. En producción, el trigger handle_new_user
-- se encargará de crearlos automáticamente.

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'pyme1@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"María González"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'pyme2@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"Rafael Mendoza"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'pyme3@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"Laura Rodríguez"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'pyme4@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"José Hernández"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'pyme5@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"Carmen Espiga"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'pyme6@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"Pedro Martínez"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'inv1@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"investor", "full_name":"Financiera CREA"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'inv2@safetyscore.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"investor", "full_name":"MicroCapital Puebla"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000099', 'authenticated', 'authenticated', 'Fer@gmail.com', 'dummy_password', now(), '{"provider":"email","providers":["email"]}', '{"role":"pyme", "full_name":"Felipe Fernando"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- NEGOCIOS (PyMEs) — Mapeados desde constants.ts MOCK_OPPORTUNITIES
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.businesses (id, owner_id, name, sector, location_city, location_state, years_operating, employees, daily_sales, fixed_costs, variable_costs, has_debts, debt_amount, safety_score, safety_sub_cashflow, safety_sub_sector, safety_sub_consistency, safety_sub_return_probability, trust_layer_analysis, status) VALUES

-- Abarrotes Doña María (constants.ts id: '1')
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Abarrotes Doña María',
  'Abarrotes',
  'Puebla', 'PUE',
  15, 3,
  4200.00, 18000.00, 45000.00,
  false, 0,
  82, 85, 78, 80, 84,
  'Abarrotes Doña María presenta un flujo de caja estable con ventas diarias consistentes de $4,200 MXN durante los últimos 6 meses. Su margen operativo del 32% está por encima del benchmark sectorial de 25% para abarrotes en la zona de Puebla. El destino solicitado (ampliación de inventario) tiene alta correlación con incremento de ventas en negocios similares. Riesgo principal: dependencia de un solo proveedor.',
  'published'
),

-- Farmacia San Rafael (constants.ts id: '2')
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000002',
  'Farmacia San Rafael',
  'Farmacia',
  'CDMX', 'CDMX',
  8, 6,
  8500.00, 35000.00, 60000.00,
  false, 0,
  88, 90, 85, 88, 89,
  'Farmacia San Rafael muestra una resiliencia excepcional. El sector farmacéutico en CDMX tiene una volatilidad baja. El crecimiento interanual del 12% valida la necesidad de expansión de inventario de medicamentos genéricos.',
  'published'
),

-- Papelería El Estudiante (constants.ts id: '3')
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000003',
  'Papelería El Estudiante',
  'Papelería',
  'Guadalajara', 'JAL',
  5, 2,
  3100.00, 12000.00, 35000.00,
  true, 25000.00,
  74, 70, 75, 72, 78,
  'Negocio con alta estacionalidad. El flujo de caja es cíclico pero predecible. El plazo corto (3 meses) mitiga el riesgo de liquidez. Se recomienda para diversificación de portafolio.',
  'published'
),

-- Taller Mecánico Automotriz (constants.ts id: '4')
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000004',
  'Taller Mecánico Automotriz',
  'Servicios',
  'Monterrey', 'NL',
  10, 8,
  6800.00, 28000.00, 40000.00,
  false, 0,
  79, 82, 74, 78, 82,
  'La base de clientes corporativos asegura un flujo de ingresos mínimo. El margen de utilidad es alto (45%). El riesgo operativo está vinculado a la retención de técnicos especializados.',
  'published'
),

-- Panadería La Espiga (constants.ts id: '5')
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000005',
  'Panadería La Espiga',
  'Alimentos',
  'Querétaro', 'QRO',
  12, 5,
  5200.00, 22000.00, 48000.00,
  false, 0,
  85, 87, 80, 86, 87,
  'Modelo de negocio híbrido (retail + B2B). La diversificación de canales de venta reduce el riesgo comercial. Excelente historial de pagos a proveedores.',
  'published'
),

-- Ferretería El Martillo (constants.ts id: '6')
(
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000006',
  'Ferretería El Martillo',
  'Construcción',
  'Mérida', 'YUC',
  7, 4,
  9500.00, 40000.00, 80000.00,
  true, 50000.00,
  71, 68, 72, 70, 74,
  'Riesgo moderado debido a la exposición al sector construcción. Sin embargo, el ROI es atractivo y la garantía prendaria (inventario) es sólida.',
  'published'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- OPORTUNIDADES DE INVERSIÓN — Mapeadas desde constants.ts
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.opportunities (id, business_id, requested_amount, funded_amount, expected_roi, term_months, fund_destination, description, status, marketplace_status, closes_at) VALUES

(
  'aaaa1111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  150000.00, 100500.00, 17.3, 6,
  'Inventario',
  'Ampliación de inventario para temporada alta. Proveedor mayorista con descuento por volumen.',
  'open', 'high-demand',
  now() + interval '12 days'
),

(
  'aaaa2222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  300000.00, 135000.00, 15.5, 12,
  'Inventario',
  'Expansión de inventario de medicamentos genéricos y equipo para consultorio médico integrado.',
  'open', 'new',
  now() + interval '25 days'
),

(
  'aaaa3333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  80000.00, 72000.00, 19.2, 3,
  'Capital de Trabajo',
  'Capital de trabajo para cubrir temporada escolar. Compra anticipada de material escolar.',
  'open', 'last-day',
  now() + interval '1 day'
),

(
  'aaaa4444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444444',
  200000.00, 60000.00, 18.5, 9,
  'Equipamiento',
  'Adquisición de equipo de diagnóstico automotriz y herramientas especializadas.',
  'open', 'new',
  now() + interval '30 days'
),

(
  'aaaa5555-5555-5555-5555-555555555555',
  '55555555-5555-5555-5555-555555555555',
  120000.00, 66000.00, 16.0, 6,
  'Expansión',
  'Apertura de punto de distribución adicional en zona industrial.',
  'open', 'high-demand',
  now() + interval '18 days'
),

(
  'aaaa6666-6666-6666-6666-666666666666',
  '66666666-6666-6666-6666-666666666666',
  400000.00, 60000.00, 21.0, 12,
  'Inventario',
  'Compra mayorista de material de construcción para atender contratos confirmados.',
  'open', 'new',
  now() + interval '45 days'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- INVERSIONES DE DEMOSTRACIÓN (Portafolio del Inversionista)
-- ─────────────────────────────────────────────────────────────────────────────
-- Mapeo .md:
--   STITCH_PROMPT.md (Pantalla 7): Lista con Negocio | Monto | Estado | Próximo Pago
--   PROMPT_SOY_INVERSIONISTA.md (Pantalla 3): KPIs + tabla de inversiones

INSERT INTO public.investments (investor_id, opportunity_id, amount, status, next_payment_date, monthly_payment) VALUES
(
  '00000000-0000-0000-0000-000000000010',
  'aaaa1111-1111-1111-1111-111111111111',
  50000.00, 'active',
  (now() + interval '15 days')::date, 8500.00
),
(
  '00000000-0000-0000-0000-000000000010',
  'aaaa2222-2222-2222-2222-222222222222',
  100000.00, 'active',
  (now() + interval '8 days')::date, 9600.00
),
(
  '00000000-0000-0000-0000-000000000010',
  'aaaa5555-5555-5555-5555-555555555555',
  35000.00, 'payment-due',
  (now() - interval '2 days')::date, 6100.00
),
(
  '00000000-0000-0000-0000-000000000011',
  'aaaa1111-1111-1111-1111-111111111111',
  50500.00, 'active',
  (now() + interval '15 days')::date, 8585.00
),
(
  '00000000-0000-0000-0000-000000000011',
  'aaaa3333-3333-3333-3333-333333333333',
  72000.00, 'active',
  (now() + interval '20 days')::date, 24960.00
);

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTIFICACIONES DE DEMOSTRACIÓN
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.notifications (user_id, title, message, type, read, created_at) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  '¡Evaluación completada!',
  'La IA asignó un SafetyScore de 82/100 a tu negocio.',
  'success', true,
  now() - interval '2 hours'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Tu solicitud fue recibida',
  'Hemos recibido todos tus datos. La IA comenzará la evaluación en breve.',
  'info', true,
  now() - interval '1 day'
),
(
  '00000000-0000-0000-0000-000000000001',
  '🎉 ¡Tienes una oferta!',
  'Financiera CREA quiere invertir $50,000 MXN en tu negocio.',
  'success', false,
  now() - interval '30 minutes'
),
(
  '00000000-0000-0000-0000-000000000010',
  '🔥 Oportunidad de alto rendimiento',
  'Ferretería El Martillo (Construcción) ofrece 21.0% ROI en Mérida.',
  'info', false,
  now() - interval '1 hour'
),
(
  '00000000-0000-0000-0000-000000000010',
  '💰 Pago recibido',
  'Pago de $8,500 MXN recibido de Abarrotes Doña María.',
  'payment', true,
  now() - interval '3 days'
);
