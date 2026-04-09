import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  BarChart3,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { View } from '../../types';
import { useToast } from '../common/ToastProvider';

interface PymeScoreProps {
  onNavigate: (view: View) => void;
}

/* ── Mock data ─────────────────────────────────────── */
const SCORE_HISTORY = [
  { mes: 'Oct', score: 72 },
  { mes: 'Nov', score: 74 },
  { mes: 'Dic', score: 78 },
  { mes: 'Ene', score: 76 },
  { mes: 'Feb', score: 82 },
  { mes: 'Mar', score: 88 },
];

const BENCHMARK_DATA = [
  { label: 'Tu Negocio', value: 88 },
  { label: 'Promedio Sector', value: 74 },
  { label: 'Top 10%', value: 93 },
];

const SCORE_FACTORS = [
  { label: 'Estabilidad de Caja', score: 85, delta: +3, color: '#00355F' },
  { label: 'Resiliencia del Sector', score: 78, delta: +1, color: '#0066B2' },
  { label: 'Consistencia Operativa', score: 92, delta: +5, color: '#00355F' },
  { label: 'Capacidad de Repago', score: 84, delta: -2, color: '#0066B2' },
];

const IMPROVEMENT_TIPS = [
  {
    title: 'Mantén un saldo mínimo de $20,000',
    desc: 'Incrementa tu Estabilidad de Caja conservando un colchón financiero por 15 días consecutivos.',
    impact: '+4 pts',
    difficulty: 'Fácil',
  },
  {
    title: 'Registra ventas los fines de semana',
    desc: 'Tu Consistencia Operativa mejora cuando demuestras actividad los 7 días de la semana.',
    impact: '+3 pts',
    difficulty: 'Medio',
  },
  {
    title: 'Diversifica tus proveedores',
    desc: 'Depender de un solo proveedor representa un riesgo. Agrega al menos 2 fuentes alternas.',
    impact: '+5 pts',
    difficulty: 'Largo plazo',
  },
];

/* ── Component ─────────────────────────────────────── */
export const PymeScore: React.FC<PymeScoreProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const currentScore = 88;
  const previousScore = 82;
  const scoreDelta = currentScore - previousScore;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-content mb-1">Mi SafetyScore</h1>
        <p className="text-content-muted">
          Tu calificación crediticia alternativa, actualizada en tiempo real.
        </p>
      </div>

      {/* ── Hero Score + Desglose ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Score Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center shadow-sm"
        >
          {/* Circular gauge */}
          <div className="relative w-52 h-52 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="52"
                fill="none" stroke="#E2E8F0" strokeWidth="10"
              />
              <motion.circle
                cx="60" cy="60" r="52"
                fill="none" stroke="#00355F" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 52 * (1 - currentScore / 100),
                }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-extrabold text-content leading-none">
                {currentScore}
              </span>
              <span className="text-xs font-semibold text-content-muted uppercase tracking-widest mt-1">
                SafetyScore
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-bold mb-4">
            <ShieldCheck size={16} />
            Perfil Óptimo
          </div>

          {/* Delta */}
          <div className="flex items-center gap-1 text-sm font-semibold">
            {scoreDelta >= 0 ? (
              <>
                <ArrowUpRight size={16} className="text-emerald-600" />
                <span className="text-emerald-600">+{scoreDelta} pts</span>
              </>
            ) : (
              <>
                <ArrowDownRight size={16} className="text-red-500" />
                <span className="text-red-500">{scoreDelta} pts</span>
              </>
            )}
            <span className="text-content-muted ml-1">vs. mes anterior</span>
          </div>
        </motion.div>

        {/* Factor Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-brand-blue" />
            Desglose de Factores
          </h2>

          <div className="space-y-5">
            {SCORE_FACTORS.map((factor, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-content">
                    {factor.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-content">
                      {factor.score}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-0.5 ${
                        factor.delta >= 0
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}
                    >
                      {factor.delta >= 0 ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {factor.delta >= 0 ? '+' : ''}
                      {factor.delta}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: factor.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.score}%` }}
                    transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Tendencia Histórica + Benchmarking ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tendencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-blue" />
            Tendencia (6 meses)
          </h2>
          <p className="text-sm text-content-muted mb-6">
            Evolución de tu SafetyScore en el tiempo
          </p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SCORE_HISTORY}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  stroke="#94A3B8"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  stroke="#94A3B8"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    color: '#0F172A',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`${value} pts`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00355F"
                  strokeWidth={3}
                  dot={{ fill: '#00355F', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#D22E1E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Benchmarking Sectorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-content mb-1 flex items-center gap-2">
            <Award size={20} className="text-primary" />
            Tu Posición
          </h2>
          <p className="text-sm text-content-muted mb-6">
            vs. sector Abarrotes en Puebla
          </p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BENCHMARK_DATA} layout="vertical" barSize={20}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="value" fill="#00355F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-brand-blue/5 rounded-xl border border-brand-blue/10">
            <p className="text-sm text-brand-blue font-semibold text-center">
              Estás <span className="font-extrabold">12% arriba</span> del promedio sectorial
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Ruta de Mejora ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
      >
        <h2 className="text-lg font-bold text-content mb-1 flex items-center gap-2">
          <Lightbulb size={20} className="text-primary" />
          Ruta de Mejora
        </h2>
        <p className="text-sm text-content-muted mb-6">
          Acciones concretas para subir tu SafetyScore
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {IMPROVEMENT_TIPS.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="group p-6 rounded-xl border border-slate-200 hover:border-brand-blue/30 hover:shadow-md transition-all cursor-pointer"
              onClick={() => showToast(`Consejo activado: "${tip.title}" — impacto esperado ${tip.impact}.`, 'info')}
            >
              {/* Impact badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold">
                  {tip.impact}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    tip.difficulty === 'Fácil'
                      ? 'bg-emerald-100 text-emerald-700'
                      : tip.difficulty === 'Medio'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tip.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-content mb-2 group-hover:text-brand-blue transition-colors">
                {tip.title}
              </h3>
              <p className="text-sm text-content-muted leading-relaxed">
                {tip.desc}
              </p>

              <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                Ver detalle <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Badge de Certificación ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-brand-blue to-[#004A80] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <Zap size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Perfil Certificado
            </h3>
            <p className="text-white/70 text-sm">
              Tu negocio cumple con los estándares de SafetyScore para ser visible ante inversionistas institucionales.
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast('Tu perfil público está activo. Inversionistas pueden verlo en el Marketplace.', 'success')}
          className="bg-white text-brand-blue font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap shadow-md"
        >
          Ver mi perfil público
        </button>
      </motion.div>
    </div>
  );
};
