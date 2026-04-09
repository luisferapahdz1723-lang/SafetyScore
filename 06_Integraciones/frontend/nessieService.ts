/**
 * nessieService.ts — Cliente de integración con la API Nessie de Capital One
 * 
 * La API Nessie simula un sistema bancario real. En SafetyScore la usamos para:
 * - Crear perfiles bancarios de PyMEs (Customers)
 * - Crear cuentas receptoras de inversión (Accounts)
 * - Simular ventas diarias como depósitos (Deposits)
 * - Registrar inyecciones de capital como transferencias (Transfers)
 * - Simular egresos operativos como compras (Purchases)
 * 
 * Base URL: http://api.nessieisreal.com
 * Docs: http://api.nessieisreal.com/documentation
 */

const NESSIE_BASE_URL = 'http://api.nessieisreal.com';
const NESSIE_API_KEY = 'a353089464cf18f18afe0e9f3a4f83fd';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS (Modelos de datos de Nessie)
// ─────────────────────────────────────────────────────────────────────────────

export interface NessieAddress {
  street_number: string;
  street_name: string;
  city: string;
  state: string;
  zip: string;
}

export interface NessieCustomer {
  _id: string;
  first_name: string;
  last_name: string;
  address: NessieAddress;
}

export interface NessieAccount {
  _id: string;
  type: 'Savings' | 'Checking' | 'Credit Card';
  nickname: string;
  rewards: number;
  balance: number;
  customer_id: string;
}

export interface NessieDeposit {
  _id: string;
  type: 'deposit';
  transaction_date: string;
  status: 'pending' | 'cancelled' | 'completed';
  medium: 'balance' | 'rewards';
  amount: number;
  description: string;
  payee_id: string;
}

export interface NessieTransfer {
  _id: string;
  type: 'transfer';
  transaction_date: string;
  status: 'pending' | 'cancelled' | 'completed';
  medium: 'balance' | 'rewards';
  amount: number;
  description: string;
  payer_id: string;
  payee_id: string;
}

export interface NessiePurchase {
  _id: string;
  type: 'purchase';
  merchant_id: string;
  purchase_date: string;
  amount: number;
  status: 'pending' | 'cancelled' | 'completed';
  medium: 'balance' | 'rewards';
  description: string;
  payer_id: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Fetch con manejo de errores
// ─────────────────────────────────────────────────────────────────────────────

async function nessieRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${NESSIE_BASE_URL}${endpoint}${separator}key=${NESSIE_API_KEY}`;

  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nessie API Error [${response.status}]: ${errorText}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPEO: Estados Mexicanos → Códigos válidos de Nessie (formato US 2-letter)
// Nessie solo acepta códigos de estado de EE.UU. Mapeamos los estados
// mexicanos a un código US equivalente para evitar errores 400.
// ─────────────────────────────────────────────────────────────────────────────
const MX_STATE_TO_NESSIE: Record<string, string> = {
  'PUE': 'TX', 'CDMX': 'NY', 'JAL': 'CA', 'NL': 'FL',
  'QRO': 'AZ', 'YUC': 'NM', 'GTO': 'CO', 'SLP': 'NV',
  'CHIH': 'MT', 'SON': 'UT', 'AGS': 'OK', 'HGO': 'AR',
  'VER': 'LA', 'OAX': 'MS', 'TAB': 'AL', 'MICH': 'MO',
  'GRO': 'SC', 'CHIS': 'GA', 'NAY': 'OR', 'SIN': 'WA',
  'COL': 'HI', 'CAMP': 'ME', 'TLAX': 'VT', 'ZAC': 'KS',
  'DUR': 'WY', 'TAMPS': 'CT', 'EDOMEX': 'IL', 'BCS': 'ID',
  'BC': 'ND', 'QROO': 'SD', 'MOR': 'NH', 'COAH': 'NE',
};

function mapStateToNessie(mexicanState: string): string {
  return MX_STATE_TO_NESSIE[mexicanState.toUpperCase()] || 'TX';
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMERS — Representan a las PyMEs en el sistema bancario
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea un nuevo cliente en Nessie (representa una PyME)
 * Se llama cuando una PyME completa el Wizard de Solicitud (Pantalla 4)
 * 
 * Mapeo .md → Nessie:
 *   STITCH_PROMPT.md (Paso 1 "Tu Negocio") → first_name = business_name
 *   Ubicación (Ciudad, Estado) → address.city, address.state
 * 
 * Nota: Nessie solo acepta estados de EE.UU. Se usa mapStateToNessie()
 * para convertir estados mexicanos a un código válido.
 */
export async function createCustomer(
  businessName: string,
  city: string,
  state: string
): Promise<{ objectCreated: NessieCustomer }> {
  return nessieRequest('/customers', 'POST', {
    first_name: businessName,
    last_name: 'SafetyScore',
    address: {
      street_number: '1',
      street_name: 'Main St',
      city,
      state: mapStateToNessie(state),
      zip: '00000',
    },
  });
}

/** Obtiene todos los clientes creados */
export async function getCustomers(): Promise<NessieCustomer[]> {
  return nessieRequest('/customers');
}

/** Obtiene un cliente por su ID */
export async function getCustomer(customerId: string): Promise<NessieCustomer> {
  return nessieRequest(`/customers/${customerId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNTS — Cuentas bancarias donde se recibe la inversión
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea una cuenta Savings para la PyME (donde recibirá fondos)
 * 
 * Mapeo .md → Nessie:
 *   CONTEXT.md: "simular el comportamiento de las cuentas donde se recibiría la inversión"
 *   nickname = nombre del negocio para identificación rápida
 */
export async function createAccount(
  customerId: string,
  businessName: string
): Promise<{ objectCreated: NessieAccount }> {
  return nessieRequest(`/customers/${customerId}/accounts`, 'POST', {
    type: 'Savings',
    nickname: `SafetyScore - ${businessName}`,
    rewards: 0,
    balance: 0,
  });
}

/** Obtiene todas las cuentas de un cliente */
export async function getAccountsByCustomer(customerId: string): Promise<NessieAccount[]> {
  return nessieRequest(`/customers/${customerId}/accounts`);
}

/** Obtiene una cuenta específica por ID */
export async function getAccount(accountId: string): Promise<NessieAccount> {
  return nessieRequest(`/accounts/${accountId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPOSITS — Simulan las ventas diarias de la PyME
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea un depósito (simula una venta diaria de la PyME)
 * 
 * Mapeo .md → Nessie:
 *   STITCH_PROMPT.md (Paso 2 "Tus Números"): "Ventas diarias promedio ($)"
 *   PROMPT_SOY_INVERSIONISTA.md: sparkline de tendencia ventas 3 meses
 *   OpportunityDetail (Pantalla 6): "Flujo de Caja Verificado (Últimos 6 Meses)"
 */
export async function createDeposit(
  accountId: string,
  amount: number,
  description: string = 'Venta diaria'
): Promise<{ objectCreated: NessieDeposit }> {
  return nessieRequest(`/accounts/${accountId}/deposits`, 'POST', {
    medium: 'balance',
    amount,
    description,
    transaction_date: new Date().toISOString().split('T')[0],
  });
}

/** Obtiene todos los depósitos de una cuenta (historial de ventas) */
export async function getDeposits(accountId: string): Promise<NessieDeposit[]> {
  return nessieRequest(`/accounts/${accountId}/deposits`);
}

/** Obtiene un depósito específico */
export async function getDeposit(depositId: string): Promise<NessieDeposit> {
  return nessieRequest(`/deposits/${depositId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFERS — Inyecciones de capital (Inversionista → PyME)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea una transferencia (inyección de capital del inversionista a la PyME)
 * 
 * Mapeo .md → Nessie:
 *   STITCH_PROMPT.md (Pantalla 6): Botón "Invertir en este Negocio"
 *   PROMPT_SOY_INVERSIONISTA.md (Pantalla 2): Botón "Inyectar Capital"
 *   PROMPT_SOY_NEGOCIO.md (Pantalla 3): "¡Hicimos Match!" → Monto ofrecido
 */
export async function createTransfer(
  payerAccountId: string,
  payeeAccountId: string,
  amount: number,
  description: string = 'Inversión SafetyScore'
): Promise<{ objectCreated: NessieTransfer }> {
  return nessieRequest(`/accounts/${payerAccountId}/transfers`, 'POST', {
    medium: 'balance',
    payee_id: payeeAccountId,
    amount,
    transaction_date: new Date().toISOString().split('T')[0],
    description,
  });
}

/** Obtiene todas las transferencias de una cuenta */
export async function getTransfers(accountId: string): Promise<NessieTransfer[]> {
  return nessieRequest(`/accounts/${accountId}/transfers`);
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASES — Simulan egresos operativos del negocio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todas las compras/egresos de una cuenta
 * 
 * Mapeo .md → Nessie:
 *   Se usa junto con getDeposits() para calcular el margen operativo real
 *   STITCH_PROMPT.md (Pantalla 6): gráfica "ingresos vs egresos últimos 6 meses"
 *   PROMPT_SOY_INVERSIONISTA.md: Benchmarking Sectorial → comparar Margen
 */
export async function getPurchases(accountId: string): Promise<NessiePurchase[]> {
  return nessieRequest(`/accounts/${accountId}/purchases`);
}

/** Crea una compra/egreso operativo */
export async function createPurchase(
  accountId: string,
  merchantId: string,
  amount: number,
  description: string = 'Gasto operativo'
): Promise<{ objectCreated: NessiePurchase }> {
  return nessieRequest(`/accounts/${accountId}/purchases`, 'POST', {
    merchant_id: merchantId,
    medium: 'balance',
    purchase_date: new Date().toISOString().split('T')[0],
    amount,
    description,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES DE NEGOCIO COMPUESTAS (SafetyScore-specific)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registra una PyME completa en Nessie:
 * 1. Crea el Customer (perfil bancario)
 * 2. Crea la Account (cuenta receptora)
 * 
 * Retorna los IDs para guardarlos en Supabase (profiles.nessie_customer_id, nessie_account_id)
 */
export async function registerBusinessInNessie(
  businessName: string,
  city: string,
  state: string
): Promise<{ customerId: string; accountId: string }> {
  // Paso 1: Crear cliente
  const customerResult = await createCustomer(businessName, city, state);
  const customerId = customerResult.objectCreated._id;

  // Paso 2: Crear cuenta Savings
  const accountResult = await createAccount(customerId, businessName);
  const accountId = accountResult.objectCreated._id;

  return { customerId, accountId };
}

/**
 * Simula el historial de ventas diarias de una PyME (últimos N días)
 * Genera depósitos con variación realista basada en el promedio de ventas diarias
 * 
 * Esto alimenta:
 *   - Sparklines en InvestorMarketplace (tendencia 3 meses)
 *   - Gráfica de "Flujo de Caja Verificado" en OpportunityDetail
 *   - Cálculo del SafetyScore (sub-métrica: Consistencia Operativa)
 */
export async function simulateDailySales(
  accountId: string,
  averageDailySales: number,
  days: number = 90
): Promise<NessieDeposit[]> {
  const deposits: NessieDeposit[] = [];

  for (let i = 0; i < days; i++) {
    // Variación aleatoria de ±20% para simular ventas realistas
    const variation = 0.8 + Math.random() * 0.4;
    const amount = Math.round(averageDailySales * variation);
    const description = `Venta día ${i + 1}`;

    try {
      const result = await createDeposit(accountId, amount, description);
      deposits.push(result.objectCreated);
    } catch (error) {
      console.warn(`Error simulando venta día ${i + 1}:`, error);
    }
  }

  return deposits;
}

/**
 * Calcula métricas financieras desde datos de Nessie
 * para alimentar el cálculo del SafetyScore
 * 
 * Mapeo directo con STITCH_PROMPT.md (Pantalla 6):
 *   - Flujo de Caja → total depósitos - total compras
 *   - Consistencia → desviación estándar de depósitos
 *   - Margen Operativo → (ingresos - egresos) / ingresos
 */
export async function calculateFinancialMetrics(accountId: string): Promise<{
  totalIncome: number;
  totalExpenses: number;
  operatingMargin: number;
  averageDailySales: number;
  salesConsistency: number; // 0-100 (100 = super consistente)
  cashFlow: number;
}> {
  const [deposits, purchases] = await Promise.all([
    getDeposits(accountId),
    getPurchases(accountId),
  ]);

  const totalIncome = deposits.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = purchases.reduce((sum, p) => sum + p.amount, 0);
  const cashFlow = totalIncome - totalExpenses;
  const operatingMargin = totalIncome > 0
    ? ((totalIncome - totalExpenses) / totalIncome) * 100
    : 0;

  const averageDailySales = deposits.length > 0
    ? totalIncome / deposits.length
    : 0;

  // Calcular consistencia: qué tan estables son las ventas
  const amounts = deposits.map(d => d.amount);
  const mean = amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  const variance = amounts.length > 0
    ? amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length
    : 0;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = mean > 0 ? (stdDev / mean) : 1;
  // Convertir a escala 0-100 (menor variación = mayor consistencia)
  const salesConsistency = Math.max(0, Math.min(100, Math.round((1 - coefficientOfVariation) * 100)));

  return {
    totalIncome: Math.round(totalIncome),
    totalExpenses: Math.round(totalExpenses),
    operatingMargin: Math.round(operatingMargin * 10) / 10,
    averageDailySales: Math.round(averageDailySales),
    salesConsistency,
    cashFlow: Math.round(cashFlow),
  };
}

/**
 * Ejecuta la inyección de capital: transfiere dinero del inversionista a la PyME
 * y retorna el ID de la transferencia para guardar en Supabase
 */
export async function executeInvestment(
  investorAccountId: string,
  businessAccountId: string,
  amount: number,
  businessName: string
): Promise<string> {
  const result = await createTransfer(
    investorAccountId,
    businessAccountId,
    amount,
    `Inversión SafetyScore → ${businessName}`
  );
  return result.objectCreated._id;
}
