-- ============================================================================
-- SafetyScore — Datos Semilla (MySQL)
-- ============================================================================

USE safetyscore;

INSERT IGNORE INTO users (id, email, password_hash) VALUES
  ('00000000-0000-0000-0000-000000000001', 'pyme1@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000002', 'pyme2@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000003', 'pyme3@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000004', 'pyme4@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000005', 'pyme5@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000006', 'pyme6@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000010', 'inv1@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000011', 'inv2@safetyscore.com', 'dummy_password'),
  ('00000000-0000-0000-0000-000000000098', 'negocio@test.com', 'password123'),
  ('00000000-0000-0000-0000-000000000099', 'inversionista@test.com', 'password123');

INSERT IGNORE INTO profiles (id, role, full_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'pyme', 'María González'),
  ('00000000-0000-0000-0000-000000000002', 'pyme', 'Rafael Mendoza'),
  ('00000000-0000-0000-0000-000000000003', 'pyme', 'Laura Rodríguez'),
  ('00000000-0000-0000-0000-000000000004', 'pyme', 'José Hernández'),
  ('00000000-0000-0000-0000-000000000005', 'pyme', 'Carmen Espiga'),
  ('00000000-0000-0000-0000-000000000006', 'pyme', 'Pedro Martínez'),
  ('00000000-0000-0000-0000-000000000010', 'investor', 'Financiera CREA'),
  ('00000000-0000-0000-0000-000000000011', 'investor', 'MicroCapital Puebla'),
  ('00000000-0000-0000-0000-000000000098', 'pyme', 'Demo Negocio'),
  ('00000000-0000-0000-0000-000000000099', 'investor', 'Demo Inversionista');

INSERT IGNORE INTO businesses (id, owner_id, name, sector, location_city, location_state, years_operating, employees, daily_sales, fixed_costs, variable_costs, has_debts, debt_amount, safety_score, safety_sub_cashflow, safety_sub_sector, safety_sub_consistency, safety_sub_return_probability, trust_layer_analysis, status) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Abarrotes Doña María', 'Abarrotes', 'Puebla', 'PUE', 15, 3, 4200.00, 18000.00, 45000.00, false, 0, 82, 85, 78, 80, 84, 'Abarrotes Doña María presenta un flujo estable.', 'published'),
('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000098', 'Servicios Demo Test', 'Servicios', 'CDMX', 'CDMX', 5, 2, 8500.00, 25000.00, 40000.00, false, 0, 88, 90, 85, 88, 89, 'Negocio modelo de prueba altamente viable.', 'published');

INSERT IGNORE INTO opportunities (
  id, business_id, goal_title, goal_description, goal_category, goal_total_units, goal_unit_cost, goal_current_units_funded,
  requested_amount, funded_amount, expected_roi, term_months, fund_destination, description, status, marketplace_status, closes_at
) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Compra de 3 refrigeradores', 'La tienda necesita 3 refrigeradores de exhibicion para bebidas y lacteos.', 'equipo', 3, 50000.00, 2, 150000.00, 100500.00, 17.3, 6, 'Equipamiento', 'Campaña para equipamiento de tienda', 'open', 'high-demand', DATE_ADD(NOW(), INTERVAL 12 DAY)),
('aaaa9999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'Compra de 2 hornos industriales', 'Se requieren 2 hornos para aumentar capacidad de producción.', 'equipo', 2, 150000.00, 0, 300000.00, 50000.00, 15.5, 12, 'Expansión', 'Campaña de expansión productiva', 'open', 'new', DATE_ADD(NOW(), INTERVAL 25 DAY));

INSERT IGNORE INTO opportunities (
  id, business_id, goal_title, goal_description, goal_category, goal_total_units, goal_unit_cost, goal_current_units_funded,
  requested_amount, funded_amount, expected_roi, term_months, fund_destination, description, status, marketplace_status, closes_at
) VALUES
('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Compra de 5 congeladores verticales', 'Permitir mayor capacidad de almacenamiento para temporada alta.', 'equipo', 5, 28000.00, 1, 140000.00, 30000.00, 16.2, 8, 'Equipamiento', 'Fondeo para aumentar capacidad de frio.', 'open', 'new', DATE_ADD(NOW(), INTERVAL 20 DAY)),
('aaaa3333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', 'Inventario para campaña navideña', 'Compra anticipada de inventario para cierre de año.', 'inventario', 10, 18000.00, 3, 180000.00, 56000.00, 18.4, 7, 'Inventario', 'Campaña para cubrir temporada de alta demanda.', 'open', 'high-demand', DATE_ADD(NOW(), INTERVAL 14 DAY)),
('aaaa4444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'Remodelacion de área de atención', 'Adecuación del área de atención para mayor flujo de clientes.', 'remodelacion', 1, 90000.00, 0, 90000.00, 12000.00, 14.9, 10, 'Remodelación', 'Campaña de mejora de experiencia de cliente.', 'open', 'last-day', DATE_ADD(NOW(), INTERVAL 2 DAY));

-- Asignar la inversión de la Demo a nuestro Investor
INSERT IGNORE INTO investments (id, investor_id, opportunity_id, amount, contributed_units, status, next_payment_date, monthly_payment) VALUES
('invv1111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000099', 'aaaa9999-9999-9999-9999-999999999999', 50000.00, 0, 'active', DATE_ADD(NOW(), INTERVAL 15 DAY), 4500.00);

-- NUEVAS TABLAS DE DATOS HISTÓRICOS Y PAGOS --

-- 1. Flujo de Caja (Últimos 6 meses para el negocio de Demo)
INSERT IGNORE INTO business_financial_records (business_id, record_month, income, expenses) VALUES
('99999999-9999-9999-9999-999999999999', '2023-10', 210000.00, 140000.00),
('99999999-9999-9999-9999-999999999999', '2023-11', 225000.00, 145000.00),
('99999999-9999-9999-9999-999999999999', '2023-12', 290000.00, 160000.00),
('99999999-9999-9999-9999-999999999999', '2024-01', 190000.00, 135000.00),
('99999999-9999-9999-9999-999999999999', '2024-02', 205000.00, 140000.00),
('99999999-9999-9999-9999-999999999999', '2024-03', 215000.00, 142000.00);

-- 2. Historial de Pagos (Amortizaciones previas)
INSERT IGNORE INTO payments (investment_id, amount_paid, paid_at, status) VALUES
('invv1111-1111-1111-1111-111111111111', 4500.00, DATE_SUB(NOW(), INTERVAL 30 DAY), 'completed'),
('invv1111-1111-1111-1111-111111111111', 4500.00, DATE_SUB(NOW(), INTERVAL 60 DAY), 'completed');

-- 3. Contratos (Mapeo entre Negocio Demo y Inversor Demo)
INSERT IGNORE INTO contracts (opportunity_id, investor_id, document_url, status) VALUES
('aaaa9999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000099', 'https://dummy.url/contrato_123.pdf', 'signed');
