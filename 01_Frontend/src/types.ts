export type View = 
  | 'landing' 
  | 'auth' 
  | 'pyme-dashboard' 
  | 'pyme-wizard' 
  | 'pyme-crowdfunding-new'
  | 'pyme-crowdfunding-list'
  | 'pyme-crowdfunding-detail'
  | 'pyme-finances'
  | 'investor-marketplace' 
  | 'opportunity-detail' 
  | 'investor-portfolio'
  | 'investor-analytics'
  | 'investor-alerts'
  | 'investor-contracts';

export type Role = 'pyme' | 'investor';

export interface BusinessOpportunity {
  id: string;
  name: string;
  sector: string;
  location: string;
  goalTitle: string;
  goalDescription: string;
  goalCategory: 'equipo' | 'inventario' | 'remodelacion';
  goalTotalUnits: number;
  goalCurrentUnitsFunded: number;
  goalUnitsRemaining: number;
  goalUnitCost: number;
  safetyScore: number;
  roi: number;
  amount: number;
  fundedAmount: number;
  term: number;
  fundedPercentage: number;
  status: 'new' | 'high-demand' | 'last-day';
  description: string;
  aiDictum: string;
}
