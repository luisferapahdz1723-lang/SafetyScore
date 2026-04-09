import React from 'react';
import { getMyCrowdfundingRequests, CrowdfundingRequest } from '../../services/supabaseClient';
import { View } from '../../types';

interface Props {
  onNavigate: (view: View) => void;
  onSelectRequest: (request: CrowdfundingRequest) => void;
}

export const PymeCrowdfundingRequests: React.FC<Props> = ({ onNavigate, onSelectRequest }) => {
  const [rows, setRows] = React.useState<CrowdfundingRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getMyCrowdfundingRequests();
        setRows(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="text-content-muted">Cargando solicitudes...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-content">Mis solicitudes de crowdfunding</h1>
        <button className="btn-primary px-4 py-2" onClick={() => onNavigate('pyme-crowdfunding-new')}>Nueva solicitud</button>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <button key={r.id} onClick={() => { onSelectRequest(r); onNavigate('pyme-crowdfunding-detail'); }} className="w-full text-left glass-panel p-4 rounded-xl border border-border hover:border-primary/40">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-content">{r.goal_title || r.title}</div>
                <div className="text-sm text-content-muted">{r.description}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-content-muted uppercase">Estado</div>
                <div className="font-bold text-content">{(r.status || 'pending').toUpperCase()}</div>
              </div>
            </div>
          </button>
        ))}
        {rows.length === 0 && <div className="text-content-muted">Aún no tienes solicitudes.</div>}
      </div>
    </div>
  );
};
