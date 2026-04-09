import React from 'react';
import { motion } from 'motion/react';
import { View } from '../../types';
import { useToast } from '../common/ToastProvider';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Activity, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Header } from '../organisms/Header';
import { getInvestorPortfolio, getPortfolioMetrics, Investment } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_PERFORMANCE = [
  { month: 'Oct', value: 420000 },
  { month: 'Nov', value: 435000 },
  { month: 'Dic', value: 450000 },
  { month: 'Ene', value: 462000 },
  { month: 'Feb', value: 475000 },
  { month: 'Mar', value: 485000 },
];

export const InvestorPortfolio: React.FC<{ onNavigate?: (v: View) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = React.useState({ totalInvested: 0, accumulatedReturn: 0, averageROI: 0, activeInvestments: 0 });
  const [investments, setInvestments] = React.useState<Investment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [mets, invs] = await Promise.all([
          getPortfolioMetrics(user.id),
          getInvestorPortfolio(user.id)
        ]);
        setMetrics(mets);
        setInvestments(invs);
      } catch (err) {
        console.error("Error loading portfolio:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="TERMINAL DE PORTAFOLIO" 
        subtitle="Monitoreo en tiempo real de tus inversiones y rendimientos." 
      />

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Capital_Invested', value: `$${loading ? '---' : metrics.totalInvested.toLocaleString()}`, icon: <DollarSign className="text-primary" />, trend: 'REAL' },
          { label: 'Accumulated_Return', value: `$${loading ? '---' : metrics.accumulatedReturn.toLocaleString()}`, icon: <TrendingUp className="text-emerald-500" />, trend: 'REAL' },
          { label: 'Avg_ROI', value: `${loading ? '---' : metrics.averageROI.toFixed(2)}%`, icon: <PieChart className="text-amber-500" />, trend: 'REAL' },
          { label: 'Active_Assets', value: loading ? '---' : metrics.activeInvestments.toString().padStart(2,'0'), icon: <Activity className="text-primary" />, trend: 'REAL' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel p-4 border-border rounded-none relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-surface-alt border border-border flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="text-[9px] font-mono font-bold px-1.5 py-0.5 border border-border text-content-muted">
                {stat.trend}
              </div>
            </div>
            <div className="text-[9px] text-content-muted font-mono uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-mono font-bold text-slate-700">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-panel p-6 border-border rounded-none">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h3 className="text-[10px] font-mono font-bold text-content-muted uppercase tracking-widest">PORTFOLIO_EQUITY_CURVE</h3>
            <div className="flex gap-1">
              {['1M', '3M', '6M', '1Y'].map((p) => (
                <button key={p} className={`px-2 py-1 font-mono text-[10px] transition-all ${p === '6M' ? 'bg-primary text-white' : 'text-content-muted hover:text-content-muted border border-border'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PERFORMANCE}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontClassName="font-mono" />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} fontClassName="font-mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0', color: '#f8fafc' }}
                  itemStyle={{ color: '#38bdf8', fontSize: '10px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="glass-panel p-6 border-border rounded-none">
          <h3 className="text-[10px] font-mono font-bold text-content-muted mb-6 uppercase tracking-widest border-b border-border pb-4">SYSTEM_ALERTS</h3>
          <div className="space-y-4">
            {[
              { 
                title: 'NEW_OPPORTUNITY', 
                desc: 'Asset detected with ROI > 20.00%.', 
                icon: <TrendingUp size={14} />, 
                color: 'text-emerald-500',
                time: '10M_AGO'
              },
              { 
                title: 'PAYMENT_RECEIVED', 
                desc: 'Abarrotes Doña María: $8,500.00 MXN.', 
                icon: <CheckCircle2 size={14} />, 
                color: 'text-primary',
                time: '02H_AGO'
              },
              { 
                title: 'MATURITY_REMINDER', 
                desc: 'Farmacia San Rafael closes in 48H.', 
                icon: <Clock size={14} />, 
                color: 'text-amber-500',
                time: '05H_AGO'
              },
              { 
                title: 'RISK_ADVISORY', 
                desc: 'Sector benchmark shift: Papelerías.', 
                icon: <AlertCircle size={14} />, 
                color: 'text-rose-500',
                time: '24H_AGO'
              }
            ].map((alert, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer border-b border-border pb-3 last:border-0">
                <div className={`w-8 h-8 bg-surface-alt flex items-center justify-center border border-border ${alert.color}`}>
                  {alert.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-[10px] font-mono font-bold text-content-muted group-hover:text-primary transition-colors">{alert.title}</div>
                    <div className="text-[8px] text-content-muted font-mono">{alert.time}</div>
                  </div>
                  <div className="text-[10px] text-content-muted font-mono leading-tight">{alert.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-[10px] font-mono font-bold text-content-muted hover:text-primary transition-colors flex items-center justify-center gap-2 border-t border-border pt-4 uppercase">
            VIEW_ALL_LOGS
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Active Investments Table */}
        <div className="lg:col-span-3 glass-panel border-border rounded-none overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-alt/30">
            <h3 className="text-[10px] font-mono font-bold text-content-muted uppercase tracking-widest">ACTIVE_POSITIONS_MONITOR</h3>
            <button className="text-[10px] text-primary font-mono font-bold hover:underline uppercase">EXPORT_DATA_CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="bg-surface-alt border-b border-border">
                  <th className="px-6 py-3 text-[9px] font-bold text-content-muted uppercase tracking-widest">ASSET_NAME</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-content-muted uppercase tracking-widest">CAPITAL_ALLOC</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-content-muted uppercase tracking-widest">ROI_EST</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-content-muted uppercase tracking-widest">STATUS_CODE</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-content-muted uppercase tracking-widest">SAFETY_SCORE</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-content-muted uppercase tracking-widest">NEXT_REPAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-xs text-content-muted">CARGANDO PORTAFOLIO...</td></tr>
                ) : investments.map((inv) => {
                  const opp = inv.opportunity;
                  const biz = opp?.business;
                  const safetyScore = biz?.safety_score || 0;
                  return (
                  <tr key={inv.id} className="hover:bg-surface-alt transition-colors cursor-pointer group">
                    <td className="px-6 py-3">
                      <div className="text-xs font-bold text-content-muted group-hover:text-primary transition-colors uppercase">{biz?.name || 'Desconocido'}</div>
                    </td>
                    <td className="px-6 py-3 text-xs text-content-muted font-mono">${inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-3 text-xs text-emerald-500 font-bold">{opp?.expected_roi}%</td>
                    <td className="px-6 py-3">
                      <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase ${
                        inv.status === 'active' ? 'border-emerald-500/30 text-emerald-500' : 'border-rose-500/30 text-rose-500'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-bold text-primary">
                          {safetyScore.toFixed(1)}
                        </div>
                        <div className="flex-1 h-0.5 w-12 bg-surface-alt overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${safetyScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[10px] text-content-muted">{inv.next_payment_date}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
