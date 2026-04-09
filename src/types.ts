export type View = 
  | 'landing' 
  | 'auth' 
  | 'pyme-dashboard' 
  | 'pyme-wizard' 
  | 'pyme-score'
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
  safetyScore: number;
  roi: number;
  amount: number;
  term: number;
  fundedPercentage: number;
  status: 'new' | 'high-demand' | 'last-day';
  description: string;
  aiDictum: string;
}
