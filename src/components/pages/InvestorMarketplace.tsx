import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  ChevronDown
} from 'lucide-react';
import { Header } from '../organisms/Header';
import { getOpportunities } from '../../services/supabaseClient';
import { mapOpportunityToUI } from '../../utils/mappers';
import { BusinessOpportunity, View } from '../../types';

interface InvestorMarketplaceProps {
  onSelectOpportunity: (opp: BusinessOpportunity) => void;
}

export const InvestorMarketplace: React.FC<InvestorMarketplaceProps> = ({ onSelectOpportunity }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await getOpportunities();
        setOpportunities(data.map(mapOpportunityToUI));
      } catch (err) {
        console.error("Error al cargar marketplace:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="TERMINAL DE MERCADO" 
        subtitle="Explora negocios verificados por IA y diversifica tu portafolio." 
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:w-80 shrink-0 sticky top-6 space-y-4">
          <div className="glass-panel p-6 space-y-8 border-border rounded-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-mono text-sm font-bold text-content-muted flex items-center gap-2 uppercase tracking-tighter">
                <Filter size={16} />
                Filtros de Búsqueda
              </h3>
              <button className="text-xs text-primary hover:underline font-mono">RESET</button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-mono font-bold text-content-muted uppercase tracking-tighter">SafetyScore Mínimo</label>
                <input type="range" className="w-full accent-primary" min="0" max="100" />
                <div className="flex justify-between text-xs text-content-muted font-mono">
                  <span>0.00</span>
                  <span>100.00</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-mono font-bold text-content-muted uppercase tracking-tighter">Sector Económico</label>
                <div className="space-y-3">
                  {['Abarrotes', 'Farmacia', 'Papelería', 'Taller', 'Servicios'].map((sector) => (
                    <label key={sector} className="flex items-center gap-3 text-sm text-content-muted cursor-pointer hover:text-primary transition-colors font-mono">
                      <input type="checkbox" className="w-4 h-4 rounded border-border bg-surface-alt accent-primary" />
                      {sector.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-mono font-bold text-content-muted uppercase tracking-tighter">ROI Esperado (MIN)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="5.00" className="input-field w-full py-2 text-sm font-mono border-border" />
                  <span className="text-content-muted font-mono text-sm">%</span>
                </div>
              </div>
            </div>

            <button className="btn-primary w-full py-3 text-sm font-mono rounded-xl uppercase tracking-widest mt-4">
              Ejecutar Filtro
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-alt p-2 border border-border">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={14} />
              <input 
                type="text" 
                placeholder="BUSCAR TICKER / SECTOR / UBICACIÓN..." 
                className="bg-transparent border-none w-full pl-10 py-1 text-xs font-mono text-content-muted focus:ring-0 placeholder:text-content-muted"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-surface-alt p-1 border border-border">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1 transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-content-muted hover:text-content-muted'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1 transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-content-muted hover:text-content-muted'}`}
                >
                  <ListIcon size={16} />
                </button>
              </div>
              <button className="text-[10px] font-mono border border-border px-3 py-1.5 text-content-muted flex items-center gap-2 hover:bg-surface-alt">
                ORDENAR: SCORE
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Grid of Opportunities */}
          {loading ? (
             <div className="flex justify-center items-center py-20 text-content-muted font-mono animate-pulse">
               CARGANDO MERCADO...
             </div>
          ) : (
            <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
              {opportunities.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelectOpportunity(opp)}
                className="glass-panel p-6 md:p-8 group cursor-pointer border-border hover:border-primary/50 transition-colors rounded-xl relative"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col gap-3 items-start">
                    {/* Badge Sector */}
                    <div className="px-3 py-1 text-xs font-bold font-mono rounded-md bg-emerald-50 text-emerald-600 uppercase border border-emerald-100">
                      {opp.sector || 'ABARROTES'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-content group-hover:text-primary transition-colors">{opp.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-content-muted mt-1">
                        <MapPin size={14} />
                        {opp.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="text-[10px] text-content-muted font-bold tracking-widest uppercase mb-1">
                      SAFETYSCORE
                    </div>
                    <div className={`text-4xl font-bold ${
                      opp.safetyScore > 80 ? 'text-emerald-500' :
                      opp.safetyScore > 70 ? 'text-amber-500' :
                      'text-rose-500'
                    }`}>
                      {opp.safetyScore.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Middle (ROI y Plazo) */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <div className="text-[10px] text-content-muted font-bold uppercase tracking-widest mb-1">
                      ROI ESTIMADO
                    </div>
                    <div className="text-2xl font-bold text-content">
                      {opp.roi.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-content-muted font-bold uppercase tracking-widest mb-1">
                      PLAZO
                    </div>
                    <div className="text-2xl font-bold text-content">
                      {opp.term} Meses
                    </div>
                  </div>
                </div>

                {/* Progress / Funding */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-content">Monto Solicitado: ${(opp.amount / 1000).toFixed(1)}K MXN</span>
                    <span className="text-content">{opp.fundedPercentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 overflow-hidden rounded-full">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${opp.fundedPercentage}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full py-4 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl uppercase tracking-widest transition-colors mt-auto">
                  ANALIZAR OPORTUNIDAD
                </button>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
