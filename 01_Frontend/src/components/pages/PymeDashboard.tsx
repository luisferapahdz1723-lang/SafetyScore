import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, CheckCircle2, ArrowUpRight, Activity, Edit3, Users
} from 'lucide-react';
import { View } from '../../types';
import { useToast } from '../common/ToastProvider';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessByOwner, Business } from '../../services/supabaseClient';

interface PymeDashboardProps {
  onNavigate: (view: View) => void;
}

export const PymeDashboard: React.FC<PymeDashboardProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { user, profile } = useAuth();
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadBusiness() {
      if (!user) return;
      try {
        const biz = await getBusinessByOwner(user.id);
        setBusiness(biz);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [user]);

  const actions = [
    {
      label: 'Crear campaña',
      icon: <Edit3 className="text-brand-blue" size={32} />,
      color: 'bg-brand-blue/10',
      onClick: () => onNavigate('pyme-crowdfunding-new'),
    },
    {
      label: 'Ver mis visitas',
      icon: <Users className="text-purple-500" size={32} />,
      color: 'bg-purple-50',
      onClick: () => showToast('Tuviste 3 visitas de inversionistas esta semana.', 'info'),
    },
  ];

  if (loading) {
    return <div className="text-center py-20 text-content-muted">Cargando tu dashboard...</div>;
  }

  // Si no tiene negocio creado, mostrar welcome state
  if (!business) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-4xl font-black text-content mb-4">Bienvenido(a), {profile?.full_name || 'Emprendedor'}</h1>
        <p className="text-content-muted text-lg mb-8">Aún no has registrado tu negocio para ser evaluado por SafetyScore.</p>
        <button onClick={() => onNavigate('pyme-wizard')} className="btn-primary px-8 py-4 text-lg rounded-2xl mx-auto flex items-center justify-center">
          Registrar mi Negocio de inmediato
          <ArrowUpRight size={24} className="ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-content mb-2">Hola, {business.name} 🏢</h1>
        <p className="text-content-muted text-lg">Aquí está el resumen de tu salud financiera hoy.</p>
      </div>

      {/* Status Card (Hero) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2.5rem] p-10 mb-12 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="10" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none" stroke="#00355F" strokeWidth="10"
                strokeDasharray="282.7"
                initial={{ strokeDashoffset: 282.7 }}
                animate={{ strokeDashoffset: 282.7 * (1 - (business.safety_score || 0) / 100) }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-content">{business.safety_score?.toFixed(0) || '0'}</span>
              <span className="text-xs font-bold text-content-muted uppercase tracking-widest">Score</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-bold mb-4">
              Perfil Óptimo
            </div>
            <h2 className="text-3xl font-black text-content mb-4">¡Estás listo para recibir inversión!</h2>
            <p className="text-content-muted text-lg mb-8 leading-relaxed">
              Tu negocio está publicado y visible para inversionistas institucionales en el Marketplace.
            </p>
            <button
              onClick={() => onNavigate('pyme-crowdfunding-list')}
              className="btn-primary px-10 py-4 text-lg rounded-2xl"
            >
              Ver mis campañas
              <ArrowUpRight size={24} />
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl opacity-50" />
      </motion.div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="glass-card flex flex-col items-center justify-center gap-4 p-8 text-center group rounded-[2rem] cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-2xl ${action.color} flex items-center justify-center transition-transform group-hover:rotate-6`}>
              {action.icon}
            </div>
            <span className="text-sm font-bold text-content">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Activity Log */}
        <div className="glass-panel rounded-[2rem] p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-content">
            <Activity size={20} className="text-brand-blue" />
            Movimientos Recientes
          </h3>
          <div className="space-y-6">
            {[
              { title: 'Solicitud Publicada', desc: 'Tu negocio ya es visible para inversionistas.', time: 'Hace 2h', icon: <CheckCircle2 className="text-brand-blue" />, onClick: () => onNavigate('pyme-wizard') },
              { title: 'Visita de Inversionista', desc: 'Un fondo institucional revisó tu perfil.', time: 'Hace 5h', icon: <Users className="text-purple-500" />, onClick: () => showToast('Fondo Capital Venture S.A. visitó tu perfil a las 14:32.', 'info') },
              { title: 'Campaña actualizada', desc: 'Tu progreso de fondeo se actualizó con nuevas visitas.', time: 'Ayer', icon: <TrendingUp className="text-brand-blue" />, onClick: () => onNavigate('pyme-crowdfunding-list') },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 cursor-pointer group hover:bg-slate-50 -mx-4 px-4 py-2 rounded-xl transition-colors"
                onClick={item.onClick}
              >
                <div className="mt-1">{item.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-content group-hover:text-brand-blue transition-colors">{item.title}</div>
                  <div className="text-xs text-content-muted mb-1">{item.desc}</div>
                  <div className="text-[10px] font-bold text-content-muted uppercase tracking-widest">{item.time}</div>
                </div>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-brand-blue transition-colors mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-panel rounded-[2rem] p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-content">
            <TrendingUp size={20} className="text-brand-blue" />
            Tus Números
          </h3>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-surface-alt border border-border">
              <div className="text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Ventas Promedio (Día)</div>
              <div className="text-3xl font-black text-content">${business.daily_sales?.toLocaleString() || '0'}</div>
            </div>
            <div className="p-6 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
              <div className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">Deuda Reportada</div>
              <div className="text-3xl font-black text-brand-blue">${(business.debt_amount || 0).toLocaleString()}</div>
            </div>
            <button
              onClick={() => onNavigate('pyme-crowdfunding-list')}
              className="w-full py-3 text-sm font-semibold text-brand-blue bg-brand-blue/5 rounded-xl hover:bg-brand-blue/10 transition-colors"
            >
              Ver campañas activas →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
