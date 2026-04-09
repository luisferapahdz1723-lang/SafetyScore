/**
 * supabaseClient.ts — Mock en memoria (sin backend)
 * Reemplaza todas las llamadas al API REST con datos hardcodeados.
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  role: 'pyme' | 'investor';
  full_name: string;
  avatar_url?: string;
  nessie_customer_id?: string;
  nessie_account_id?: string;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  sector: string;
  location_city: string;
  location_state: string;
  years_operating: number;
  employees: number;
  daily_sales: number;
  fixed_costs: number;
  variable_costs: number;
  has_debts: boolean;
  debt_amount: number;
  safety_score: number;
  safety_sub_cashflow: number;
  safety_sub_sector: number;
  safety_sub_consistency: number;
  safety_sub_return_probability: number;
  trust_layer_analysis: string;
  status: 'draft' | 'evaluating' | 'scored' | 'published' | 'funded';
  created_at: string;
}

export interface Opportunity {
  id: string;
  business_id: string;
  requested_amount: number;
  funded_amount: number;
  expected_roi: number;
  term_months: number;
  fund_destination: string;
  description: string;
  status: 'open' | 'funded' | 'active' | 'completed';
  funded_percentage: number;
  marketplace_status: 'new' | 'high-demand' | 'last-day';
  published_at: string;
  closes_at: string;
  created_at: string;
  business?: Business;
}

export interface Investment {
  id: string;
  investor_id: string;
  opportunity_id: string;
  amount: number;
  nessie_transfer_id?: string;
  status: 'active' | 'payment-due' | 'overdue' | 'completed';
  next_payment_date: string;
  monthly_payment: number;
  created_at: string;
  opportunity?: Opportunity & { business?: Business };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'payment';
  read: boolean;
  created_at: string;
}

export interface FinancialRecord {
  id: string;
  business_id: string;
  record_month: string;
  income: number;
  expenses: number;
  balance: number;
  created_at: string;
}

export interface Payment {
  id: string;
  investment_id: string;
  amount_paid: number;
  paid_at: string;
  status: 'completed' | 'failed' | 'pending';
}

export interface Contract {
  id: string;
  opportunity_id: string;
  investor_id: string;
  document_url: string;
  status: 'pending' | 'signed' | 'rejected';
  signed_at: string;
}

export interface PortfolioMetrics {
  totalInvested: number;
  accumulatedReturn: number;
  averageROI: number;
  activeInvestments: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, { id: string; email: string; password: string }> = {
  'negocio@test.com':      { id: 'usr-0098', email: 'negocio@test.com',      password: 'password123' },
  'inversionista@test.com':{ id: 'usr-0099', email: 'inversionista@test.com', password: 'password123' },
};

const MOCK_PROFILES: Record<string, Profile> = {
  'usr-0098': { id: 'usr-0098', role: 'pyme',     full_name: 'Demo Negocio',       created_at: '2024-01-01T00:00:00Z' },
  'usr-0099': { id: 'usr-0099', role: 'investor',  full_name: 'Demo Inversionista', created_at: '2024-01-01T00:00:00Z' },
};

const MOCK_BUSINESSES: Business[] = [
  {
    id: 'biz-0001', owner_id: 'usr-0098',
    name: 'Servicios Demo Tech', sector: 'Tecnología',
    location_city: 'CDMX', location_state: 'CDMX',
    years_operating: 5, employees: 8,
    daily_sales: 8500, fixed_costs: 25000, variable_costs: 40000,
    has_debts: false, debt_amount: 0,
    safety_score: 88,
    safety_sub_cashflow: 90, safety_sub_sector: 85,
    safety_sub_consistency: 88, safety_sub_return_probability: 89,
    trust_layer_analysis: 'Negocio de tecnología con flujo de caja estable y alta consistencia en ventas mensuales. Bajo riesgo operativo.',
    status: 'published', created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'biz-0002', owner_id: 'ext-0001',
    name: 'Abarrotes Doña María', sector: 'Abarrotes',
    location_city: 'Puebla', location_state: 'PUE',
    years_operating: 15, employees: 3,
    daily_sales: 4200, fixed_costs: 18000, variable_costs: 45000,
    has_debts: false, debt_amount: 0,
    safety_score: 82,
    safety_sub_cashflow: 85, safety_sub_sector: 78,
    safety_sub_consistency: 80, safety_sub_return_probability: 84,
    trust_layer_analysis: 'Abarrotes con 15 años en el mercado. Clientela fija y ventas predecibles. Ideal para inversión conservadora.',
    status: 'published', created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'biz-0003', owner_id: 'ext-0002',
    name: 'Taquería El Rincón', sector: 'Restaurante',
    location_city: 'Guadalajara', location_state: 'JAL',
    years_operating: 8, employees: 12,
    daily_sales: 6800, fixed_costs: 30000, variable_costs: 55000,
    has_debts: true, debt_amount: 45000,
    safety_score: 75,
    safety_sub_cashflow: 72, safety_sub_sector: 70,
    safety_sub_consistency: 78, safety_sub_return_probability: 80,
    trust_layer_analysis: 'Restaurante con fuerte demanda local. La deuda es manejable dado su flujo. ROI atractivo a corto plazo.',
    status: 'published', created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'biz-0004', owner_id: 'ext-0003',
    name: 'Farmacia Vida Sana', sector: 'Farmacia',
    location_city: 'Monterrey', location_state: 'NL',
    years_operating: 12, employees: 6,
    daily_sales: 9200, fixed_costs: 35000, variable_costs: 60000,
    has_debts: false, debt_amount: 0,
    safety_score: 91,
    safety_sub_cashflow: 93, safety_sub_sector: 90,
    safety_sub_consistency: 92, safety_sub_return_probability: 89,
    trust_layer_analysis: 'Farmacia con alto volumen de clientes recurrentes. Sector defensivo con mínima volatilidad. Score élite.',
    status: 'published', created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'biz-0005', owner_id: 'ext-0004',
    name: 'Ferretería Los Compadres', sector: 'Ferretería',
    location_city: 'León', location_state: 'GTO',
    years_operating: 20, employees: 5,
    daily_sales: 5500, fixed_costs: 22000, variable_costs: 48000,
    has_debts: false, debt_amount: 0,
    safety_score: 85,
    safety_sub_cashflow: 84, safety_sub_sector: 88,
    safety_sub_consistency: 86, safety_sub_return_probability: 82,
    trust_layer_analysis: '20 años de trayectoria. Base de clientes de construcción y contratistas. Muy estable y con potencial de expansión.',
    status: 'published', created_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 'biz-0006', owner_id: 'ext-0005',
    name: 'Panadería La Espiga de Oro', sector: 'Alimentos',
    location_city: 'Querétaro', location_state: 'QRO',
    years_operating: 6, employees: 4,
    daily_sales: 3800, fixed_costs: 15000, variable_costs: 38000,
    has_debts: true, debt_amount: 20000,
    safety_score: 71,
    safety_sub_cashflow: 68, safety_sub_sector: 72,
    safety_sub_consistency: 73, safety_sub_return_probability: 71,
    trust_layer_analysis: 'Panadería artesanal con demanda creciente. La deuda es reciente para equipamiento. Perfil moderado de riesgo.',
    status: 'published', created_at: '2024-02-10T00:00:00Z',
  },
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-0001', business_id: 'biz-0001',
    requested_amount: 300000, funded_amount: 50000, expected_roi: 15.5,
    term_months: 12, fund_destination: 'Expansión de sucursal',
    description: 'Expansión de operaciones tech para atender nuevos clientes corporativos en CDMX y zona metropolitana.',
    status: 'open', funded_percentage: 16.7, marketplace_status: 'new',
    published_at: '2025-03-01T00:00:00Z', closes_at: '2025-05-01T00:00:00Z', created_at: '2025-03-01T00:00:00Z',
    business: MOCK_BUSINESSES[0],
  },
  {
    id: 'opp-0002', business_id: 'biz-0002',
    requested_amount: 150000, funded_amount: 100500, expected_roi: 17.3,
    term_months: 6, fund_destination: 'Inventario',
    description: 'Ampliación de inventario para temporada alta. Historial comprobado de 15 años con pagos puntuales.',
    status: 'open', funded_percentage: 67, marketplace_status: 'high-demand',
    published_at: '2025-03-15T00:00:00Z', closes_at: '2025-04-21T00:00:00Z', created_at: '2025-03-15T00:00:00Z',
    business: MOCK_BUSINESSES[1],
  },
  {
    id: 'opp-0003', business_id: 'biz-0003',
    requested_amount: 200000, funded_amount: 180000, expected_roi: 19.8,
    term_months: 9, fund_destination: 'Segunda sucursal',
    description: 'Apertura de segunda taquería en zona universitaria con alta demanda comprobada.',
    status: 'open', funded_percentage: 90, marketplace_status: 'last-day',
    published_at: '2025-02-20T00:00:00Z', closes_at: '2025-04-10T00:00:00Z', created_at: '2025-02-20T00:00:00Z',
    business: MOCK_BUSINESSES[2],
  },
  {
    id: 'opp-0004', business_id: 'biz-0004',
    requested_amount: 500000, funded_amount: 125000, expected_roi: 14.2,
    term_months: 18, fund_destination: 'Nueva sucursal',
    description: 'Apertura de segundo punto de venta en Monterrey Norte. Farmacia con mayor tráfico de la zona.',
    status: 'open', funded_percentage: 25, marketplace_status: 'new',
    published_at: '2025-03-20T00:00:00Z', closes_at: '2025-06-20T00:00:00Z', created_at: '2025-03-20T00:00:00Z',
    business: MOCK_BUSINESSES[3],
  },
  {
    id: 'opp-0005', business_id: 'biz-0005',
    requested_amount: 180000, funded_amount: 144000, expected_roi: 21.3,
    term_months: 6, fund_destination: 'Capital de trabajo',
    description: 'Capital de trabajo para abastecer proyectos de construcción de vivienda en León. Contratos firmados.',
    status: 'open', funded_percentage: 80, marketplace_status: 'high-demand',
    published_at: '2025-03-10T00:00:00Z', closes_at: '2025-04-12T00:00:00Z', created_at: '2025-03-10T00:00:00Z',
    business: MOCK_BUSINESSES[4],
  },
  {
    id: 'opp-0006', business_id: 'biz-0006',
    requested_amount: 80000, funded_amount: 12000, expected_roi: 16.0,
    term_months: 12, fund_destination: 'Horno industrial',
    description: 'Adquisición de horno industrial para triplicar capacidad de producción y atender pedidos al mayoreo.',
    status: 'open', funded_percentage: 15, marketplace_status: 'new',
    published_at: '2025-03-25T00:00:00Z', closes_at: '2025-05-25T00:00:00Z', created_at: '2025-03-25T00:00:00Z',
    business: MOCK_BUSINESSES[5],
  },
];

const MOCK_INVESTMENTS: Investment[] = [
  {
    id: 'inv-0001', investor_id: 'usr-0099', opportunity_id: 'opp-0001',
    amount: 50000, status: 'active',
    next_payment_date: '2025-05-15T00:00:00Z', monthly_payment: 4500,
    created_at: '2025-03-05T00:00:00Z',
    opportunity: { ...MOCK_OPPORTUNITIES[0], business: MOCK_BUSINESSES[0] },
  },
  {
    id: 'inv-0002', investor_id: 'usr-0099', opportunity_id: 'opp-0002',
    amount: 75000, status: 'active',
    next_payment_date: '2025-04-20T00:00:00Z', monthly_payment: 6800,
    created_at: '2025-03-15T00:00:00Z',
    opportunity: { ...MOCK_OPPORTUNITIES[1], business: MOCK_BUSINESSES[1] },
  },
  {
    id: 'inv-0003', investor_id: 'usr-0099', opportunity_id: 'opp-0005',
    amount: 36000, status: 'payment-due',
    next_payment_date: '2025-04-11T00:00:00Z', monthly_payment: 3200,
    created_at: '2025-03-10T00:00:00Z',
    opportunity: { ...MOCK_OPPORTUNITIES[4], business: MOCK_BUSINESSES[4] },
  },
];

const MOCK_NOTIFICATIONS: Record<string, Notification[]> = {
  'usr-0099': [
    { id: 'notif-001', user_id: 'usr-0099', title: 'Pago recibido', message: 'Abarrotes Doña María realizó su pago mensual de $6,800.', type: 'payment', read: false, created_at: '2025-04-09T08:00:00Z' },
    { id: 'notif-002', user_id: 'usr-0099', title: 'Pago próximo', message: 'Ferretería Los Compadres tiene pago el 11 de Abril.', type: 'warning', read: false, created_at: '2025-04-08T10:00:00Z' },
    { id: 'notif-003', user_id: 'usr-0099', title: 'Nueva oportunidad', message: 'Farmacia Vida Sana abrió una nueva ronda de inversión.', type: 'info', read: true, created_at: '2025-04-07T09:00:00Z' },
    { id: 'notif-004', user_id: 'usr-0099', title: 'Score actualizado', message: 'Servicios Demo Tech subió su SafetyScore a 88 puntos.', type: 'success', read: true, created_at: '2025-04-06T11:00:00Z' },
  ],
  'usr-0098': [
    { id: 'notif-101', user_id: 'usr-0098', title: 'Visita de inversionista', message: 'Un fondo institucional revisó tu perfil hoy a las 14:32.', type: 'info', read: false, created_at: '2025-04-09T07:00:00Z' },
    { id: 'notif-102', user_id: 'usr-0098', title: 'Score actualizado', message: 'Tu SafetyScore subió 3 puntos por consistencia en ventas.', type: 'success', read: true, created_at: '2025-04-08T09:00:00Z' },
  ],
};

const MOCK_FINANCIAL_RECORDS: FinancialRecord[] = [
  { id: 'fr-01', business_id: 'biz-0001', record_month: '2024-10', income: 210000, expenses: 140000, balance: 70000, created_at: '2024-11-01T00:00:00Z' },
  { id: 'fr-02', business_id: 'biz-0001', record_month: '2024-11', income: 225000, expenses: 145000, balance: 80000, created_at: '2024-12-01T00:00:00Z' },
  { id: 'fr-03', business_id: 'biz-0001', record_month: '2024-12', income: 290000, expenses: 160000, balance: 130000, created_at: '2025-01-01T00:00:00Z' },
  { id: 'fr-04', business_id: 'biz-0001', record_month: '2025-01', income: 190000, expenses: 135000, balance: 55000, created_at: '2025-02-01T00:00:00Z' },
  { id: 'fr-05', business_id: 'biz-0001', record_month: '2025-02', income: 240000, expenses: 150000, balance: 90000, created_at: '2025-03-01T00:00:00Z' },
  { id: 'fr-06', business_id: 'biz-0001', record_month: '2025-03', income: 265000, expenses: 155000, balance: 110000, created_at: '2025-04-01T00:00:00Z' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  await delay(400);

  const entry = MOCK_USERS[email.toLowerCase()];
  if (!entry) throw new Error('Usuario no encontrado. Usa negocio@test.com o inversionista@test.com');
  if (entry.password !== password) throw new Error('Contraseña incorrecta. Usa "password123"');

  const profile = MOCK_PROFILES[entry.id];
  const userData = {
    id: entry.id,
    email: entry.email,
    user_metadata: { role: profile.role, full_name: profile.full_name },
  };

  const session = {
    access_token: 'MOCK_TOKEN_' + Date.now(),
    user: userData,
    profile,
  };

  localStorage.setItem('app_session', JSON.stringify(session));
  return { user: userData, session };
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export async function getProfile(id: string): Promise<Profile | null> {
  await delay(100);
  return MOCK_PROFILES[id] ?? null;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  await delay(200);
  const existing = MOCK_PROFILES[userId];
  if (!existing) throw new Error('Perfil no encontrado');
  const updated = { ...existing, ...updates };
  MOCK_PROFILES[userId] = updated;
  return updated;
}

// ─── Businesses ───────────────────────────────────────────────────────────────

export async function getBusinessByOwner(ownerId: string): Promise<Business | null> {
  await delay(200);
  return MOCK_BUSINESSES.find(b => b.owner_id === ownerId) ?? null;
}

export async function createBusiness(business: Omit<Business, 'id' | 'created_at'>): Promise<Business> {
  await delay(400);
  const newBiz: Business = {
    ...business,
    id: 'biz-' + Date.now(),
    created_at: new Date().toISOString(),
  };
  MOCK_BUSINESSES.push(newBiz);
  return newBiz;
}

export async function updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business> {
  await delay(300);
  const idx = MOCK_BUSINESSES.findIndex(b => b.id === businessId);
  if (idx === -1) throw new Error('Negocio no encontrado');
  MOCK_BUSINESSES[idx] = { ...MOCK_BUSINESSES[idx], ...updates };
  return MOCK_BUSINESSES[idx];
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export async function getOpportunities(): Promise<Opportunity[]> {
  await delay(300);
  return MOCK_OPPORTUNITIES.filter(o => o.status === 'open');
}

// ─── Investments ──────────────────────────────────────────────────────────────

export async function getInvestorPortfolio(investorId: string): Promise<Investment[]> {
  await delay(300);
  return MOCK_INVESTMENTS.filter(i => i.investor_id === investorId);
}

export async function getPortfolioMetrics(investorId: string): Promise<PortfolioMetrics> {
  await delay(200);
  const investments = MOCK_INVESTMENTS.filter(i => i.investor_id === investorId);
  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const activeInvestments = investments.filter(i => i.status === 'active').length;
  const roiValues = investments.map(i => {
    const opp = MOCK_OPPORTUNITIES.find(o => o.id === i.opportunity_id);
    return opp?.expected_roi ?? 0;
  });
  const averageROI = roiValues.length ? roiValues.reduce((a, b) => a + b, 0) / roiValues.length : 0;
  const accumulatedReturn = totalInvested * (averageROI / 100) * (3 / 12);
  return { totalInvested, accumulatedReturn, averageROI, activeInvestments };
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay(150);
  return MOCK_NOTIFICATIONS[userId] ?? [];
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  await delay(100);
  for (const list of Object.values(MOCK_NOTIFICATIONS)) {
    const n = list.find(x => x.id === id);
    if (n) { n.read = true; return true; }
  }
  return false;
}

export async function createNotification(n: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<void> {
  await delay(100);
  const list = MOCK_NOTIFICATIONS[n.user_id] ?? [];
  list.unshift({ ...n, id: 'notif-' + Date.now(), read: false, created_at: new Date().toISOString() });
  MOCK_NOTIFICATIONS[n.user_id] = list;
}

// ─── Financial Records ────────────────────────────────────────────────────────

export async function getFinancialRecords(businessId: string): Promise<FinancialRecord[]> {
  await delay(200);
  return MOCK_FINANCIAL_RECORDS.filter(r => r.business_id === businessId);
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export async function getContracts(_filters: { investor_id?: string; opportunity_id?: string }): Promise<Contract[]> {
  await delay(200);
  // No contracts in demo
  return [];
}
