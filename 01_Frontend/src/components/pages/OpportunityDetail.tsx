import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Brain, 
  CheckCircle2,
  Info,
  Users,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { BusinessOpportunity, View } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { createInvestment, getOpportunityById } from '../../services/supabaseClient';
import { mapOpportunityToUI } from '../../utils/mappers';
import { useAuth } from '../../contexts/AuthContext';

interface OpportunityDetailProps {
  opportunity: BusinessOpportunity;
  onBack: () => void;
}

const MOCK_CASH_FLOW = [
  { month: 'Oct', ingresos: 120000, egresos: 85000 },
  { month: 'Nov', ingresos: 125000, egresos: 82000 },
  { month: 'Dic', ingresos: 145000, egresos: 95000 },
  { month: 'Ene', ingresos: 118000, egresos: 78000 },
  { month: 'Feb', ingresos: 122000, egresos: 80000 },
  { month: 'Mar', ingresos: 130000, egresos: 84000 },
];

const MOCK_BENCHMARK = [
  { metric: 'Margen', este: 32, sector: 25 },
  { metric: 'Ventas', este: 126, sector: 100 },
  { metric: 'Costos', este: 80, sector: 95 },
];

export const OpportunityDetail: React.FC<OpportunityDetailProps> = ({ opportunity, onBack }) => {
  const { user } = useAuth();
  const [opportunityData, setOpportunityData] = React.useState<BusinessOpportunity>(opportunity);
  const [investmentAmount, setInvestmentAmount] = React.useState('');
  const [investing, setInvesting] = React.useState(false);
  const [investMessage, setInvestMessage] = React.useState('');

  React.useEffect(() => {
    setOpportunityData(opportunity);
  }, [opportunity]);

  const refreshOpportunity = async () => {
    const fresh = await getOpportunityById(opportunityData.id);
    if (fresh) setOpportunityData(mapOpportunityToUI(fresh));
  };

  const handleInvest = async () => {
    if (!user) {
      setInvestMessage('Debes iniciar sesión para invertir.');
      return;
    }
    const amount = Number(investmentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setInvestMessage('Ingresa un monto válido.');
      return;
    }

    try {
      setInvesting(true);
      setInvestMessage('');
      const result = await createInvestment({
        investor_id: user.id,
        opportunity_id: opportunityData.id,
        amount
      });
      await refreshOpportunity();
      const unitsCovered = result.contributedUnits || Math.floor(amount / Math.max(opportunityData.goalUnitCost, 1));
      setInvestMessage(`Inversión registrada. Con tu aporte cubres ${unitsCovered} unidad(es).`);
      setInvestmentAmount('');
    } catch (error: any) {
      setInvestMessage(error?.message || 'No se pudo registrar la inversión.');
    } finally {
      setInvesting(false);
    }
  };

  const projectedUnits = Math.floor((Number(investmentAmount) || 0) / Math.max(opportunityData.goalUnitCost, 1));

  return (
    <div className="max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-content-muted hover:text-primary transition-colors mb-6 group font-mono text-xs"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        BACK_TO_MARKETPLACE
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface-alt p-6 border border-border">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-content uppercase tracking-tight">{opportunityData.name}</h1>
                <span className="px-2 py-0.5 border border-border text-content-muted text-[10px] font-mono uppercase tracking-widest">
                  {opportunityData.sector}
                </span>
              </div>
              <div className="flex items-center gap-4 text-content-muted font-mono text-[10px]">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {opportunityData.location.toUpperCase()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  LISTED: 3D_AGO
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 text-emerald-500 font-mono text-[10px] uppercase">
              <ShieldCheck size={14} />
              AI_VERIFIED_ASSET
            </div>
          </div>

          {/* SafetyScore Hero */}
          <div className="glass-panel grid md:grid-cols-2 gap-8 items-center p-8 border-border rounded-none">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-content" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"
                    strokeDasharray="282.7"
                    initial={{ strokeDashoffset: 282.7 }}
                    animate={{ strokeDashoffset: 282.7 * (1 - opportunityData.safetyScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-emerald-500"
                    strokeLinecap="butt"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-mono font-bold text-content">{opportunityData.safetyScore.toFixed(1)}</span>
                  <span className="text-[9px] text-content-muted font-mono uppercase tracking-tighter">Safety_Score</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-emerald-500 mb-1 uppercase tracking-widest">HEALTH: OPTIMAL</div>
                <p className="text-[10px] text-content-muted font-mono">12M_HISTORICAL_DATA_AUDIT</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Cash_Flow_Stability', score: 85 },
                { label: 'Sector_Viability', score: 78 },
                { label: 'Operational_Consistency', score: 80 },
                { label: 'Repayment_Probability', score: 84 },
              ].map((metric, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-content-muted">{metric.label}</span>
                    <span className="text-content-muted">{metric.score.toFixed(2)}</span>
                  </div>
                  <div className="h-1 w-full bg-surface-alt overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score}%` }}
                      transition={{ delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Dictum */}
          <div className="glass-panel border-primary/20 bg-primary/5 p-6 relative overflow-hidden rounded-none">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary flex items-center justify-center text-white">
                  <Brain size={18} />
                </div>
                <h3 className="text-xs font-mono font-bold text-primary uppercase tracking-widest">AI_VIRTUAL_ANALYST_REPORT</h3>
              </div>
              <div className="text-content-muted font-mono text-xs leading-relaxed mb-6 space-y-4">
                <p>{opportunityData.aiDictum}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-500 text-[9px] font-mono uppercase">RISK: LOW_MODERATE</span>
                <span className="px-2 py-0.5 border border-primary/30 text-primary text-[9px] font-mono uppercase">BENCHMARK: OUTPERFORM</span>
                <span className="px-2 py-0.5 border border-border text-content-muted text-[9px] font-mono uppercase">COLLATERAL: INVENTORY</span>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-border rounded-none">
              <h3 className="text-[10px] font-mono font-bold text-content-muted mb-6 uppercase tracking-widest">VERIFIED_CASH_FLOW (6M)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CASH_FLOW}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontClassName="font-mono" />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} fontClassName="font-mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0', color: '#f8fafc' }}
                      itemStyle={{ color: '#38bdf8', fontSize: '10px', fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="ingresos" stroke="#10B981" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={2} />
                    <Area type="monotone" dataKey="egresos" stroke="#f43f5e" fill="transparent" strokeDasharray="3 3" strokeWidth={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 border-border rounded-none">
              <h3 className="text-[10px] font-mono font-bold text-content-muted mb-6 uppercase tracking-widest">SECTOR_BENCHMARKING</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_BENCHMARK}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="metric" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontClassName="font-mono" />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontClassName="font-mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0', color: '#f8fafc' }}
                      itemStyle={{ color: '#38bdf8', fontSize: '10px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="este" fill="#38bdf8" radius={[0, 0, 0, 0]} name="ASSET" />
                    <Bar dataKey="sector" fill="#1e293b" radius={[0, 0, 0, 0]} name="SECTOR_AVG" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Card */}
        <aside className="lg:w-80">
          <div className="sticky top-6 space-y-4">
            <div className="glass-panel p-6 border-border rounded-none bg-surface-alt/30">
              <div className="text-center mb-6">
                <div className="text-[10px] text-content-muted uppercase tracking-widest font-mono mb-2">CAPITAL_REQUIRED</div>
                <div className="text-3xl font-mono font-bold text-content">${opportunityData.amount.toLocaleString()}</div>
              </div>

              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-content-muted">Funding_Progress</span>
                    <span className="text-primary">{opportunityData.fundedPercentage}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-alt overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${opportunityData.fundedPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-content-muted font-mono uppercase">
                    <span>${opportunityData.fundedAmount.toLocaleString()} committed</span>
                    <span>GOAL: ${opportunityData.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border border-border bg-surface-alt">
                    <div className="text-[8px] text-content-muted uppercase font-mono mb-1">ANNUAL_ROI</div>
                    <div className="text-lg font-mono font-bold text-emerald-500">{opportunityData.roi.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 border border-border bg-surface-alt">
                    <div className="text-[8px] text-content-muted uppercase font-mono mb-1">TERM_M</div>
                    <div className="text-lg font-mono font-bold text-primary">{opportunityData.term}</div>
                  </div>
                </div>

                <div className="p-3 border border-border bg-surface-alt space-y-2">
                  <div className="text-[8px] text-content-muted uppercase font-mono">Objetivo de crowdfunding</div>
                  <div className="text-xs font-bold text-content">{opportunityData.goalTitle}</div>
                  <div className="text-[10px] text-content-muted font-mono">{opportunityData.goalCurrentUnitsFunded}/{opportunityData.goalTotalUnits} unidades cubiertas</div>
                  <div className="text-[10px] text-content-muted font-mono">Costo unitario: ${opportunityData.goalUnitCost.toLocaleString()} MXN</div>
                  <div className="text-[10px] text-content-muted font-mono">Faltan: {opportunityData.goalUnitsRemaining} unidades</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-mono text-content-muted uppercase">
                    <div className="flex items-center gap-2">
                      <Users size={12} />
                      <span>Active_Investors</span>
                    </div>
                    <span className="text-content-muted">04</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-content-muted uppercase">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span>Time_Remaining</span>
                    </div>
                    <span className="text-rose-500">12D_04H</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Monto a invertir (MXN)"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="input-field w-full py-3 text-sm font-mono border-border"
                />
                <div className="text-[10px] text-content-muted font-mono">
                  Con tu aporte cubres aprox. {projectedUnits} unidad(es).
                </div>
                <button
                  onClick={handleInvest}
                  disabled={investing}
                  className="btn-primary w-full py-3 text-xs font-mono rounded-none uppercase tracking-widest shadow-lg shadow-primary/10 disabled:opacity-60"
                >
                  {investing ? 'PROCESANDO...' : 'INVERTIR EN ESTE OBJETIVO'}
                </button>
                {investMessage && (
                  <div className="text-[10px] font-mono text-content-muted">{investMessage}</div>
                )}
              </div>
              <p className="text-center text-[8px] text-content-muted mt-4 font-mono uppercase leading-tight">
                BY EXECUTING, YOU AGREE TO THE TERMS OF THE MASTER INVESTMENT AGREEMENT.
              </p>
            </div>

            <div className="glass-panel p-4 border-border rounded-none">
              <h4 className="text-[10px] font-mono font-bold text-content-muted mb-4 flex items-center gap-2 uppercase">
                <Info size={12} className="text-primary" />
                Workflow_Steps
              </h4>
              <ul className="space-y-2">
                {[
                  'DIGITAL_CONTRACT_SIGNING',
                  'FUNDS_TRANSFER_PROTOCOL',
                  'MONTHLY_REPAYMENT_CYCLE',
                  'REAL_TIME_MONITORING'
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-[9px] text-content-muted font-mono">
                    <div className="w-4 h-4 border border-border flex items-center justify-center text-[8px] font-bold text-content-muted">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
