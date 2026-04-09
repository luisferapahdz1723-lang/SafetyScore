import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Truck,
  Zap,
  Users,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

/* ── Mock data ─────────────────────────────────────── */
const CASH_FLOW_DATA = [
  { mes: 'Oct', ingresos: 128000, egresos: 89000 },
  { mes: 'Nov', ingresos: 135000, egresos: 92000 },
  { mes: 'Dic', ingresos: 162000, egresos: 105000 },
  { mes: 'Ene', ingresos: 118000, egresos: 85000 },
  { mes: 'Feb', ingresos: 142000, egresos: 88000 },
  { mes: 'Mar', ingresos: 155000, egresos: 94000 },
];

const EXPENSE_BREAKDOWN = [
  { name: 'Proveedores', value: 42, color: '#00355F' },
  { name: 'Nómina', value: 25, color: '#0066B2' },
  { name: 'Renta', value: 15, color: '#D22E1E' },
  { name: 'Servicios', value: 10, color: '#94A3B8' },
  { name: 'Otros', value: 8, color: '#CBD5E1' },
];

const DAILY_SALES = [
  { dia: 'Lun', ventas: 5200 },
  { dia: 'Mar', ventas: 4800 },
  { dia: 'Mié', ventas: 6100 },
  { dia: 'Jue', ventas: 5500 },
  { dia: 'Vie', ventas: 7200 },
  { dia: 'Sáb', ventas: 8900 },
  { dia: 'Dom', ventas: 3200 },
];

const TRANSACTIONS = [
  { id: 1, desc: 'Venta mostrador', amount: +4250, date: 'Hoy, 14:32', icon: <ShoppingCart size={16} />, type: 'ingreso' },
  { id: 2, desc: 'Pago a Proveedor - Bimbo', amount: -12800, date: 'Hoy, 10:15', icon: <Truck size={16} />, type: 'egreso' },
  { id: 3, desc: 'Venta mayoreo', amount: +18500, date: 'Ayer, 17:45', icon: <ShoppingCart size={16} />, type: 'ingreso' },
  { id: 4, desc: 'Pago CFE', amount: -3200, date: 'Ayer, 09:00', icon: <Zap size={16} />, type: 'egreso' },
  { id: 5, desc: 'Venta mostrador', amount: +3890, date: '6 Abr, 16:20', icon: <ShoppingCart size={16} />, type: 'ingreso' },
  { id: 6, desc: 'Nómina semanal', amount: -15400, date: '5 Abr, 08:00', icon: <Users size={16} />, type: 'egreso' },
];

/* ── Component ─────────────────────────────────────── */
export const PymeFinances: React.FC = () => {
  const [txFilter, setTxFilter] = useState<'todos' | 'ingreso' | 'egreso'>('todos');

  const balance = 287450;
  const ingresosMes = 155000;
  const egresosMes = 94000;
  const margenOperativo = ((ingresosMes - egresosMes) / ingresosMes * 100).toFixed(1);

  const filteredTx = txFilter === 'todos'
    ? TRANSACTIONS
    : TRANSACTIONS.filter(t => t.type === txFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-content mb-1">Mis Finanzas</h1>
        <p className="text-content-muted">
          Resumen financiero de Abarrotes Doña María — Marzo 2026
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Balance Actual',
            value: `$${balance.toLocaleString()}`,
            delta: '+8.2%',
            up: true,
            icon: <Wallet size={20} />,
            accent: 'bg-brand-blue/10 text-brand-blue',
          },
          {
            label: 'Ingresos (Mes)',
            value: `$${ingresosMes.toLocaleString()}`,
            delta: '+12.4%',
            up: true,
            icon: <TrendingUp size={20} />,
            accent: 'bg-emerald-100 text-emerald-700',
          },
          {
            label: 'Egresos (Mes)',
            value: `$${egresosMes.toLocaleString()}`,
            delta: '+3.1%',
            up: true,
            icon: <TrendingDown size={20} />,
            accent: 'bg-red-100 text-red-600',
          },
          {
            label: 'Margen Operativo',
            value: `${margenOperativo}%`,
            delta: '+2.1%',
            up: true,
            icon: <DollarSign size={20} />,
            accent: 'bg-brand-blue/10 text-brand-blue',
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.accent}`}>
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

      {/* ── Flujo de Caja + Distribución de Gastos ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1">Flujo de Caja</h2>
          <p className="text-sm text-content-muted mb-6">Ingresos vs Egresos — Últimos 6 meses</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CASH_FLOW_DATA}>
                <defs>
                  <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00355F" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00355F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D22E1E" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#D22E1E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#00355F" strokeWidth={2.5} fillOpacity={1} fill="url(#gradIngresos)" name="Ingresos" />
                <Area type="monotone" dataKey="egresos" stroke="#D22E1E" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#gradEgresos)" name="Egresos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-blue" />
              <span className="text-content-muted">Ingresos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-dashed border-primary" />
              <span className="text-content-muted">Egresos</span>
            </div>
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1">¿En qué gastas?</h2>
          <p className="text-sm text-content-muted mb-4">Distribución mensual</p>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EXPENSE_BREAKDOWN}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {EXPENSE_BREAKDOWN.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {EXPENSE_BREAKDOWN.map((item, i) => (
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

      {/* ── Ventas por Día + Transacciones ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Daily Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1 flex items-center gap-2">
            <Calendar size={18} className="text-brand-blue" />
            Ventas esta Semana
          </h2>
          <p className="text-sm text-content-muted mb-6">Promedio diario: $5,843</p>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_SALES} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="dia" stroke="#94A3B8" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ventas']}
                />
                <Bar dataKey="ventas" fill="#00355F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-emerald-700 font-semibold text-center">
              Sábado es tu mejor día — <span className="font-extrabold">$8,900</span> en ventas
            </p>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-content">Últimos Movimientos</h2>
              <p className="text-sm text-content-muted">Actividad reciente de tu cuenta</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {(['todos', 'ingreso', 'egreso'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    txFilter === f
                      ? 'bg-white text-brand-blue shadow-sm'
                      : 'text-content-muted hover:text-content'
                  }`}
                >
                  {f === 'todos' ? 'Todos' : f === 'ingreso' ? 'Ingresos' : 'Egresos'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'ingreso'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-content">{tx.desc}</div>
                    <div className="text-xs text-content-muted">{tx.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${
                    tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </span>
                  <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 text-sm font-semibold text-brand-blue bg-brand-blue/5 rounded-xl hover:bg-brand-blue/10 transition-colors">
            Ver todos los movimientos
          </button>
        </motion.div>
      </div>

      {/* ── Meta de Financiamiento ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-brand-blue to-[#004A80] rounded-2xl p-8 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Meta de Financiamiento</h3>
            <p className="text-white/70 text-sm mb-4">
              Tu solicitud de $150,000 MXN para ampliación de inventario está activa en el Marketplace.
            </p>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">$100,500 comprometidos</span>
                <span className="text-white font-bold">67%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '67%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>4 inversionistas activos</span>
              <span>·</span>
              <span>Estimado de cierre: 12 días</span>
            </div>
          </div>

          <button className="bg-white text-brand-blue font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap shadow-md">
            Ver estado de la solicitud
          </button>
        </div>
      </motion.div>
    </div>
  );
};
