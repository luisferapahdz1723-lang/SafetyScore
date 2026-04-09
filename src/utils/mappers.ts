import { BusinessOpportunity } from '../types';
import { Opportunity } from '../services/supabaseClient';

/**
 * Traduce el modelo relacional de Supabase (tablas hijas y properties con snake_case) 
 * a la estructura plana que espera la interfaz de usuario en React.
 */
export function mapOpportunityToUI(supabaseOpp: Opportunity): BusinessOpportunity {
  const biz = supabaseOpp.business;
  
  return {
    id: supabaseOpp.id,
    name: biz?.name || 'Negocio Confidencial',
    sector: biz?.sector || 'Otro',
    location: `${biz?.location_city || 'Ubicación'}, ${biz?.location_state || 'ND'}`,
    safetyScore: biz?.safety_score || 0,
    roi: supabaseOpp.expected_roi || 0,
    amount: supabaseOpp.requested_amount || 0,
    term: supabaseOpp.term_months || 0,
    fundedPercentage: supabaseOpp.funded_percentage || 0,
    status: supabaseOpp.marketplace_status as 'new' | 'high-demand' | 'last-day',
    description: supabaseOpp.description || '',
    aiDictum: biz?.trust_layer_analysis || ''
  };
}
