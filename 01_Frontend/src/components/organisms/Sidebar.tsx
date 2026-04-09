import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  FileText, 
  Activity, 
  PieChart, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { View, Role } from '../../types';
import { getMarketplaceSummary, MarketplaceSummary } from '../../services/supabaseClient';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  role: Role;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, role, onLogout }) => {
  const [summary, setSummary] = React.useState<MarketplaceSummary | null>(null);

  React.useEffect(() => {
    async function loadSummary() {
      if (role !== 'investor') {
        setSummary(null);
        return;
      }
      try {
        const data = await getMarketplaceSummary();
        setSummary(data);
      } catch (error) {
        console.warn('No se pudo cargar el resumen de marketplace', error);
        setSummary(null);
      }
    }

    loadSummary();
  }, [role]);

  const pymeLinks = [
    { id: 'pyme-dashboard', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'pyme-wizard', label: 'Mi Solicitud', icon: <FileText size={20} /> },
    { id: 'pyme-crowdfunding-new', label: 'Nueva campaña', icon: <FileText size={20} /> },
    { id: 'pyme-crowdfunding-list', label: 'Mis campañas', icon: <PieChart size={20} /> },
  ];

  const investorLinks = [
    { id: 'investor-portfolio', label: 'Mi Portafolio', icon: <PieChart size={20} /> },
    { id: 'investor-marketplace', label: 'Marketplace', icon: <Home size={20} /> },
    { id: 'investor-analytics', label: 'Análisis', icon: <Activity size={20} /> },
    { id: 'investor-contracts', label: 'Mis Contratos', icon: <FileText size={20} /> },
    { id: 'investor-alerts', label: 'Alertas', icon: <Bell size={20} /> },
  ];

  const links = role === 'pyme' ? pymeLinks : investorLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-border flex flex-col z-50 shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-brand-blue/20">S</div>
          <span className="text-xl font-display font-bold text-brand-blue">SafetyScore</span>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === link.id 
                  ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/10 font-semibold' 
                  : 'text-content-muted hover:text-brand-blue hover:bg-surface-alt'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
              {currentView === link.id && (
                <motion.div layoutId="sidebar-active" className="ml-auto">
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        {role === 'investor' && summary && (
          <div className="mt-6 p-4 rounded-xl border border-border bg-surface-alt space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-content-muted font-mono">Marketplace Real</div>
            <div className="flex justify-between text-xs text-content-muted font-mono">
              <span>Abiertas</span>
              <span className="font-bold text-content">{summary.openOpportunities}</span>
            </div>
            <div className="flex justify-between text-xs text-content-muted font-mono">
              <span>ROI promedio</span>
              <span className="font-bold text-content">{summary.averageROI.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs text-content-muted font-mono">
              <span>High demand</span>
              <span className="font-bold text-content">{summary.highDemandPercentage.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto p-8 space-y-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-content-muted hover:text-brand-blue hover:bg-surface-alt transition-all">
          <Settings size={20} />
          <span>Configuración</span>
        </button>
        
        <div className="pt-4 border-t border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-border flex items-center justify-center text-content-muted font-bold shadow-sm">
            {role === 'pyme' ? 'DJ' : 'IA'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-brand-blue truncate">
              {role === 'pyme' ? 'Don José' : 'Inv. Institucional'}
            </div>
            <div className="text-xs text-content-muted truncate">
              {role === 'pyme' ? 'Abarrotes Doña María' : 'Premium Member'}
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-content-muted hover:text-brand-red transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
