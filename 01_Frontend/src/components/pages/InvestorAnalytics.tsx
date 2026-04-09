import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon,
  ArrowUpRight, ArrowDownRight, Download, Calendar, Filter
} from 'lucide-react';
import { View } from '../../types';
import { useToast } from '../common/ToastProvider';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const ROI_HISTORY = [
  { mes: 'Oct', roi: 14.2, benchmark: 11.0 },
  { mes: 'Nov', roi: 15.8, benchmark: 11.5 },
  { mes: 'Dic', roi: 13.9, benchmark: 10.8 },
  { mes: 'Ene', roi: 17.3, benchmark: 12.1 },
  { mes: 'Feb', roi: 18.1, benchmark: 12.4 },
  { mes: 'Mar', roi: 19.5, benchmark: 12.9 },
];

const SECTOR_PERFORMANCE = [
  { sector: 'Abarrotes', roi: 19.5, inversiones: 3 },
  { sector: 'Restaurantes', roi: 16.2, inversiones: 2 },
  { sector: 'Textil', roi: 14.8, inversiones: 1 },
  { sector: 'Ferretería', roi: 21.3, inversiones: 2 },
  { sector: 'Farmacia', roi: 17.9, inversiones: 1 },
];

const RISK_DISTRIBUTION = [
  { name: 'Riesgo Bajo', value: 55, color: '#00355F' },
  { name: 'Riesgo Moderado', value: 35, color: '#0066B2' },
  { name: 'Riesgo Alto', value: 10, color: '#D22E1E' },
];

const CAPITAL_FLOW = [
  { mes: 'Oct', desplegado: 80000, recuperado: 12000 },
  { mes: 'Nov', desplegado: 95000, recuperado: 18000 },
  { mes: 'Dic', desplegado: 110000, recuperado: 24000 },
  { mes: 'Ene', desplegado: 125000, recuperado: 31000 },
  { mes: 'Feb', desplegado: 140000, recuperado: 38000 },
  { mes: 'Mar', desplegado: 158000, recuperado: 47500 },
];

const PORTFOLIO_ASSETS = [
  { negocio: 'Abarrotes Doña María', score: 88, roi: 19.5, monto: 25000, status: 'al_día', trend: +3.2 },
  { negocio: 'Ferretería El Clavo', score: 91, roi: 21.3, monto: 40000, status: 'al_día', trend: +1.8 },
  { negocio: 'Restaurante La Paloma', score: 76, roi: 16.2, monto: 18000, status: 'alerta', trend: -2.1 },
  { negocio: 'Taller Mecánico Rápido', score: 82, roi: 17.9, monto: 30000, status: 'al_día', trend: +0.9 },
  { negocio: 'Textil Moderna', score: 74, roi: 14.8, monto: 15000, status: 'revisión', trend: -0.4 },
];

interface InvestorAnalyticsProps {
  onNavigate: (view: View) => void;
}

export const InvestorAnalytics: React.FC<InvestorAnalyticsProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-content mb-1">Análisis & Reportes</h1>
          <p className="text-content-muted">Rendimiento consolidado de tu portafolio de inversión</p>
        </div>
        <button
          onClick={() => showToast('Generando reporte PDF... recibirás el archivo en un momento.', 'info')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-content-muted hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm"
        >
          <Download size={16} />
          Exportar PDF
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ROI Promedio Real', value: '19.5%', delta: '+7.1% vs CETES', up: true, icon: <TrendingUp size={20} /> },
          { label: 'Capital Desplegado', value: '$158,000', delta: '+$18K este mes', up: true, icon: <BarChart3 size={20} /> },
          { label: 'Capital Recuperado', value: '$47,500', delta: '30% del total', up: true, icon: <ArrowUpRight size={20} /> },
          { label: 'Tasa de Morosidad', value: '0%', delta: 'Sin atrasos activos', up: true, icon: <TrendingDown size={20} /> },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                {kpi.icon}
              </div>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.delta}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-content mb-1">{kpi.value}</div>
            <div className="text-xs text-content-muted font-medium">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ROI vs Benchmark + Capital Flow */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-content">ROI vs. Benchmark</h2>
              <p className="text-sm text-content-muted">vs. CETES 28 días</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {(['3m', '6m', '1y'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-white text-brand-blue shadow-sm' : 'text-content-muted'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ROI_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '13px' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Line type="monotone" dataKey="roi" stroke="#00355F" strokeWidth={3} dot={{ fill: '#00355F', r: 5, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#D22E1E' }} name="Tu portafolio" />
                <Line type="monotone" dataKey="benchmark" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="CETES 28d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-blue" /><span className="text-content-muted">Tu portafolio</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300" /><span className="text-content-muted">CETES 28 días</span></div>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1">Distribución de Riesgo</h2>
          <p className="text-sm text-content-muted mb-4">Por SafetyScore de activos</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK_DISTRIBUTION} innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {RISK_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '13px' }} formatter={(v: number) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {RISK_DISTRIBUTION.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-content-muted">{item.name}</span>
                </div>
                <span className="font-bold text-content">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Capital Flow + Sector Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1">Flujo de Capital</h2>
          <p className="text-sm text-content-muted mb-6">Capital desplegado vs. recuperado</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CAPITAL_FLOW} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '13px' }} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
                <Bar dataKey="desplegado" fill="#00355F" radius={[4, 4, 0, 0]} name="Desplegado" />
                <Bar dataKey="recuperado" fill="#10B981" radius={[4, 4, 0, 0]} name="Recuperado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1">ROI por Sector</h2>
          <p className="text-sm text-content-muted mb-6">Rendimiento promedio por industria</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_PERFORMANCE} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="sector" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '13px' }} formatter={(v: number) => [`${v}%`, 'ROI']} />
                <Bar dataKey="roi" fill="#00355F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Asset Detail Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
      >
        <h2 className="text-lg font-bold text-content mb-6">Detalle de Activos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-bold text-content-muted uppercase tracking-widest border-b border-slate-100">
                <th className="text-left pb-4">Negocio</th>
                <th className="text-center pb-4">SafetyScore</th>
                <th className="text-center pb-4">ROI Real</th>
                <th className="text-center pb-4">Capital</th>
                <th className="text-center pb-4">Tendencia</th>
                <th className="text-center pb-4">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PORTFOLIO_ASSETS.map((asset, i) => (
                <tr
                  key={i}
                  onClick={() => onNavigate('investor-contracts')}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 font-semibold text-content text-sm">{asset.negocio}</td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-bold text-brand-blue">{asset.score}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-bold text-emerald-600">{asset.roi}%</span>
                  </td>
                  <td className="py-4 text-center text-sm font-semibold text-content">
                    ${asset.monto.toLocaleString()}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`text-xs font-bold flex items-center justify-center gap-0.5 ${asset.trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {asset.trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {asset.trend > 0 ? '+' : ''}{asset.trend}%
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      asset.status === 'al_día' ? 'bg-emerald-100 text-emerald-700'
                      : asset.status === 'alerta' ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {asset.status === 'al_día' ? 'Al día' : asset.status === 'alerta' ? 'Alerta' : 'Revisión'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
