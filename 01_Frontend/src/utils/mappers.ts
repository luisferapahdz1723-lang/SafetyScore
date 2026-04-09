import { BusinessOpportunity } from '../types';
import { Opportunity } from '../services/supabaseClient';

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

/**
 * Traduce el modelo relacional de Supabase (tablas hijas y properties con snake_case) 
 * a la estructura plana que espera la interfaz de usuario en React.
 */
export function mapOpportunityToUI(supabaseOpp: Opportunity): BusinessOpportunity {
  const biz = supabaseOpp.business;
  const goalTotalUnits = Math.max(1, toNumber(supabaseOpp.goal_total_units, 1));
  const goalCurrentUnitsFunded = Math.max(0, toNumber(supabaseOpp.goal_current_units_funded, 0));
  const goalUnitsRemaining = Math.max(0, toNumber(supabaseOpp.goal_units_remaining, goalTotalUnits - goalCurrentUnitsFunded));
  
  return {
    id: supabaseOpp.id,
    name: biz?.name || 'Negocio Confidencial',
    sector: biz?.sector || 'Otro',
    location: `${biz?.location_city || 'Ubicación'}, ${biz?.location_state || 'ND'}`,
    goalTitle: supabaseOpp.goal_title || 'Capital de trabajo',
    goalDescription: supabaseOpp.goal_description || supabaseOpp.description || '',
    goalCategory: (supabaseOpp.goal_category as 'equipo' | 'inventario' | 'remodelacion') || 'inventario',
    goalTotalUnits,
    goalCurrentUnitsFunded,
    goalUnitsRemaining,
    goalUnitCost: Math.max(0, toNumber(supabaseOpp.goal_unit_cost, 0)),
    safetyScore: toNumber(biz?.safety_score),
    roi: toNumber(supabaseOpp.expected_roi),
    amount: toNumber(supabaseOpp.requested_amount),
    fundedAmount: toNumber(supabaseOpp.funded_amount),
    term: toNumber(supabaseOpp.term_months),
    fundedPercentage: toNumber(supabaseOpp.funded_percentage),
    status: supabaseOpp.marketplace_status as 'new' | 'high-demand' | 'last-day',
    description: supabaseOpp.description || '',
    aiDictum: biz?.trust_layer_analysis || ''
  };
}
