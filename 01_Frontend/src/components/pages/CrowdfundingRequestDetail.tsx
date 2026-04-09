import React from 'react';
import { CrowdfundingRequest } from '../../services/supabaseClient';
import { View } from '../../types';

interface Props {
  request: CrowdfundingRequest | null;
  onNavigate: (view: View) => void;
}

export const CrowdfundingRequestDetail: React.FC<Props> = ({ request, onNavigate }) => {
  if (!request) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-content-muted mb-4">No hay solicitud seleccionada.</div>
        <button className="btn-primary px-4 py-2" onClick={() => onNavigate('pyme-crowdfunding-list')}>Volver</button>
      </div>
    );
  }

  const goal = Number(request.funding_goal || 0);
  const funded = Number(request.funded_amount || 0);
  const pct = goal > 0 ? Math.min(100, (funded / goal) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="glass-panel p-6 rounded-2xl border border-border">
        <h1 className="text-3xl font-black text-content mb-2">{request.goal_title || request.title}</h1>
        <p className="text-content-muted mb-4">{request.goal_description || request.description}</p>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div><div className="text-xs text-content-muted uppercase">Meta</div><div className="font-bold">${goal.toLocaleString()} MXN</div></div>
          <div><div className="text-xs text-content-muted uppercase">Fondeado</div><div className="font-bold">${funded.toLocaleString()} MXN</div></div>
          <div><div className="text-xs text-content-muted uppercase">Estado</div><div className="font-bold">{(request.status || 'pending').toUpperCase()}</div></div>
        </div>
        <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-content-muted mt-2">{pct.toFixed(1)}% de avance</div>
      </div>
      <button className="btn-secondary px-4 py-2" onClick={() => onNavigate('pyme-crowdfunding-list')}>Volver al listado</button>
    </div>
  );
};
