const API_BASE = 'http://localhost:8000';

type UserMetadata = { role?: string; full_name?: string };
type AppUser = { id: string; email: string; user_metadata?: UserMetadata };

export interface Profile {
  id: string;
  role: 'pyme' | 'investor' | string;
  full_name: string;
  avatar_url?: string | null;
  nessie_customer_id?: string | null;
  nessie_account_id?: string | null;
  created_at?: string;
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
  has_debts: boolean | number;
  debt_amount: number;
  safety_score: number;
  safety_sub_cashflow?: number;
  safety_sub_sector?: number;
  safety_sub_consistency?: number;
  safety_sub_return_probability?: number;
  trust_layer_analysis?: string;
  status?: string;
  nessie_account_id?: string | null;
}

export interface Opportunity {
  id: string;
  business_id: string;
  goal_title?: string;
  goal_description?: string;
  goal_category?: 'equipo' | 'inventario' | 'remodelacion' | string;
  goal_total_units?: number | string;
  goal_unit_cost?: number | string;
  goal_current_units_funded?: number | string;
  goal_units_remaining?: number | string;
  requested_amount: number | string;
  funded_amount?: number | string;
  expected_roi: number | string;
  term_months: number | string;
  funded_percentage: number | string;
  marketplace_status: 'new' | 'high-demand' | 'last-day' | string;
  description?: string;
  status?: string;
  business?: Business;
}

export interface Investment {
  id: string;
  investor_id: string;
  opportunity_id: string;
  amount: number;
  status: string;
  next_payment_date?: string;
  opportunity?: Opportunity;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'payment';
  read: number | boolean;
  created_at?: string;
}

export interface MarketplaceSummary {
  openOpportunities: number;
  totalRequestedAmount: number;
  totalFundedAmount: number;
  averageROI: number;
  highDemandPercentage: number;
}

export interface OpportunitiesEnrichedResponse {
  opportunities: Opportunity[];
  source: 'mysql' | 'mysql+nessie';
}

export interface InvestmentCreatePayload {
  investor_id: string;
  opportunity_id: string;
  amount: number;
}

export interface CrowdfundingRequest {
  id: string;
  business_id: string;
  title?: string;
  description: string;
  objective?: string;
  goal_title?: string;
  goal_description?: string;
  goal_category?: 'equipo' | 'inventario' | 'remodelacion' | string;
  funding_goal?: number;
  funded_amount?: number;
  status?: 'pending' | 'approved' | 'funded' | 'rejected' | string;
  deadline_days?: number;
  reward_tiers_json?: string | null;
  business?: Business;
}

type SignInResponse = {
  user: AppUser;
  session: {
    access_token: string;
    user: AppUser;
    profile?: Profile;
  };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionRaw = localStorage.getItem('app_session');
  let token: string | null = null;
  if (sessionRaw) {
    try {
      token = JSON.parse(sessionRaw)?.access_token || null;
    } catch {
      token = null;
    }
  }
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {})
    },
    ...init,
  });

  if (!res.ok) {
    let message = `Error HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {
      // ignore parse errors for non-json response
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function signIn(email: string, password: string) {
  const data = await request<SignInResponse>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const profile: Profile = data.session.profile || {
    id: data.user.id,
    role: data.user.user_metadata?.role || 'pyme',
    full_name: data.user.user_metadata?.full_name || 'Usuario',
  };

  const session = {
    access_token: data.session.access_token,
    user: data.user,
    profile,
  };
  localStorage.setItem('app_session', JSON.stringify(session));
  return { user: session.user, session };
}

export async function getBusinessByOwner(ownerId: string): Promise<Business | null> {
  return request<Business | null>(`/api/businesses?owner_id=${encodeURIComponent(ownerId)}`);
}

export async function createBusiness(payload: Partial<Business>): Promise<Business> {
  return request<Business>('/api/businesses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  return request<Profile>(`/api/profiles/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function getOpportunities(): Promise<Opportunity[]> {
  return request<Opportunity[]>('/api/opportunities');
}

export async function getMarketplaceSummary(): Promise<MarketplaceSummary> {
  return request<MarketplaceSummary>('/api/marketplace/summary');
}

export async function getOpportunitiesEnriched(): Promise<OpportunitiesEnrichedResponse> {
  const opportunities = await getOpportunities();
  return {
    opportunities,
    source: 'mysql'
  };
}

export async function getInvestorPortfolio(investorId: string): Promise<Investment[]> {
  return request<Investment[]>(`/api/investments?investor_id=${encodeURIComponent(investorId)}`);
}

export async function getOpportunityById(opportunityId: string): Promise<Opportunity | null> {
  return request<Opportunity | null>(`/api/opportunities/${encodeURIComponent(opportunityId)}`);
}

export async function createInvestment(payload: InvestmentCreatePayload): Promise<{
  success: boolean;
  investedAmount: number;
  contributedUnits: number;
  fundedAmount: number;
  goalCurrentUnitsFunded: number;
}> {
  return request('/api/investments', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getPortfolioMetrics(investorId: string): Promise<{
  totalInvested: number;
  accumulatedReturn: number;
  averageROI: number;
  activeInvestments: number;
}> {
  return request(`/api/portfolio/${encodeURIComponent(investorId)}/metrics`);
}

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  return request<NotificationItem[]>(`/api/notifications?user_id=${encodeURIComponent(userId)}`);
}

export async function createCrowdfundingRequest(payload: {
  business_id: string;
  title: string;
  description: string;
  objective: string;
  goal_category: 'equipo' | 'inventario' | 'remodelacion';
  funding_goal: number;
  deadline_days: number;
  reward_tiers_json?: string | null;
}): Promise<CrowdfundingRequest> {
  return request<CrowdfundingRequest>('/api/crowdfunding/requests', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getMyCrowdfundingRequests(): Promise<CrowdfundingRequest[]> {
  return request<CrowdfundingRequest[]>('/api/crowdfunding/requests/me');
}
