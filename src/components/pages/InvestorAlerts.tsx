import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, Star, Zap, Filter
} from 'lucide-react';
import { View } from '../../types';
import { useToast } from '../common/ToastProvider';

const ALERTS = [
  {
    id: 1,
    type: 'oportunidad',
    title: 'Nueva oportunidad que coincide con tu perfil',
    desc: 'Ferretera Don Lupe — SafetyScore 89 | ROI estimado 22.1% | Monto: $50,000',
    time: 'Hace 8 min',
    unread: true,
    priority: 'alta',
    icon: <Star size={16} />,
    color: 'bg-brand-blue/10 text-brand-blue',
    navigateTo: 'investor-marketplace' as View,
  },
  {
    id: 2,
    type: 'cierre',
    title: 'Oportunidad por vencer en 24 horas',
    desc: 'Abarrotes El Sol necesita $12,000 más para alcanzar su meta de financiamiento.',
    time: 'Hace 2h',
    unread: true,
    priority: 'urgente',
    icon: <Clock size={16} />,
    color: 'bg-red-100 text-red-600',
    navigateTo: 'investor-marketplace' as View,
  },
  {
    id: 3,
    type: 'score',
    title: 'SafetyScore actualizado en Restaurante La Paloma',
    desc: 'El score bajó de 80 → 76 pts. Consulta el reporte de movimientos para más detalles.',
    time: 'Hace 5h',
    unread: true,
    priority: 'media',
    icon: <AlertTriangle size={16} />,
    color: 'bg-amber-100 text-amber-700',
    navigateTo: 'investor-analytics' as View,
  },
  {
    id: 4,
    type: 'pago',
    title: 'Pago recibido — Ferretera El Clavo',
    desc: 'Mensualidad #3 de 6 recibida correctamente. $1,850 MXN abonados a tu cuenta.',
    time: 'Ayer, 10:32',
    unread: false,
    priority: 'info',
    icon: <CheckCircle2 size={16} />,
    color: 'bg-emerald-100 text-emerald-700',
    navigateTo: 'investor-contracts' as View,
  },
  {
    id: 5,
    type: 'oportunidad',
    title: 'Tendencia alcista en sector Ferretera',
    desc: 'Los negocios de ferretera en tu portafolio superan el benchmark sectorial un 15%.',
    time: 'Ayer, 08:00',
    unread: false,
    priority: 'info',
    icon: <TrendingUp size={16} />,
    color: 'bg-brand-blue/10 text-brand-blue',
    navigateTo: 'investor-analytics' as View,
  },
  {
    id: 6,
    type: 'pago',
    title: 'Pago recibido — Abarrotes Doña María',
    desc: 'Mensualidad #2 de 6 recibida. $1,562 MXN abonados a tu cuenta.',
    time: 'Hace 3 días',
    unread: false,
    priority: 'info',
    icon: <CheckCircle2 size={16} />,
    color: 'bg-emerald-100 text-emerald-700',
    navigateTo: 'investor-contracts' as View,
  },
];

const PRIORITY_LABEL: Record<string, string> = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Media',
  info: 'Informativa',
};

const PRIORITY_COLOR: Record<string, string> = {
  urgente: 'bg-red-100 text-red-600',
  alta: 'bg-brand-blue/10 text-brand-blue',
  media: 'bg-amber-100 text-amber-700',
  info: 'bg-slate-100 text-slate-500',
};

interface InvestorAlertsProps {
  onNavigate: (view: View) => void;
}

export const InvestorAlerts: React.FC<InvestorAlertsProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'todas' | 'oportunidad' | 'pago' | 'score' | 'cierre'>('todas');
  const [alerts, setAlerts] = useState(ALERTS);

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
    showToast('Todas las notificaciones marcadas como leídas.', 'success');
  };

  const filtered = activeFilter === 'todas'
    ? alerts
    : alerts.filter(a => a.type === activeFilter);

  const unreadCount = alerts.filter(a => a.unread).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-content mb-1 flex items-center gap-3">
            Alertas
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-content-muted">Notificaciones de tu actividad e inversiones activas</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-content-muted hover:text-brand-blue transition-all shadow-sm"
        >
          Marcar todo como leído
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Sin leer', value: unreadCount, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
          { label: 'Urgentes', value: 1, color: 'text-red-600', bg: 'bg-red-100' },
          { label: 'Oportunidades', value: 2, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
          { label: 'Pagos recibidos', value: 2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center"
          >
            <div className={`text-3xl font-extrabold mb-1 ${card.color}`}>{card.value}</div>
            <div className="text-xs text-content-muted font-medium">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['todas', 'oportunidad', 'cierre', 'score', 'pago'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeFilter === f
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white border border-slate-200 text-content-muted hover:text-brand-blue'
            }`}
          >
            {f === 'todas' ? 'Todas' : f === 'oportunidad' ? 'Oportunidades'
            : f === 'cierre' ? 'Por vencer' : f === 'score' ? 'Score' : 'Pagos'}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onNavigate(alert.navigateTo)}
            className={`bg-white rounded-2xl border p-6 shadow-sm cursor-pointer group hover:shadow-md transition-all ${alert.unread ? 'border-brand-blue/20' : 'border-slate-200'}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.color}`}>
                {alert.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <p className={`text-sm font-bold leading-snug ${alert.unread ? 'text-content' : 'text-content-muted'}`}>
                    {alert.title}
                    {alert.unread && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />
                    )}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_COLOR[alert.priority]}`}>
                      {PRIORITY_LABEL[alert.priority]}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-content-muted leading-relaxed mb-2">{alert.desc}</p>
                <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
              </div>

              {/* Arrow */}
              <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-blue transition-colors flex-shrink-0 mt-1" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preferences Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-brand-blue to-[#004A80] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base">Configura tus preferencias de alerta</p>
            <p className="text-white/70 text-sm">Define sectores, montos mínimos de ROI y umbral de SafetyScore que te interesen.</p>
          </div>
        </div>
        <button
          onClick={() => showToast('Redirigiendo a preferencias de notificación...', 'info')}
          className="bg-white text-brand-blue font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap shadow-md"
        >
          Configurar
        </button>
      </motion.div>
    </div>
  );
};
