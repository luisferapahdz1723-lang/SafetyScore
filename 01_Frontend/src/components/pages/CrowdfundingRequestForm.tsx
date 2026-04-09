import React from 'react';
import { createCrowdfundingRequest, getBusinessByOwner } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { View } from '../../types';

interface Props {
  onNavigate: (view: View) => void;
}

export const CrowdfundingRequestForm: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    objective: '',
    goal_category: 'inventario' as 'equipo' | 'inventario' | 'remodelacion',
    funding_goal: '',
    deadline_days: '30',
    reward_tiers_json: ''
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      setMessage('');
      const business = await getBusinessByOwner(user.id);
      if (!business) {
        setMessage('Primero registra tu negocio.');
        return;
      }
      await createCrowdfundingRequest({
        business_id: business.id,
        title: form.title,
        description: form.description,
        objective: form.objective,
        goal_category: form.goal_category,
        funding_goal: Number(form.funding_goal),
        deadline_days: Number(form.deadline_days),
        reward_tiers_json: form.reward_tiers_json || null
      });
      setMessage('Solicitud creada correctamente.');
      onNavigate('pyme-crowdfunding-list');
    } catch (error: any) {
      setMessage(error?.message || 'Error creando solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black text-content mb-2">Nueva solicitud de crowdfunding</h1>
      <p className="text-content-muted mb-8">Define monto, objetivo y recompensas para fondeo colectivo.</p>
      <form onSubmit={onSubmit} className="space-y-4 glass-panel p-6 rounded-2xl border border-border">
        <input className="input-field w-full" placeholder="Título de la solicitud" value={form.title} onChange={(e) => update('title', e.target.value)} required />
        <textarea className="input-field w-full min-h-24" placeholder="Descripción" value={form.description} onChange={(e) => update('description', e.target.value)} required />
        <textarea className="input-field w-full min-h-20" placeholder="Objetivo (qué comprarás y por qué)" value={form.objective} onChange={(e) => update('objective', e.target.value)} required />
        <div className="grid md:grid-cols-3 gap-4">
          <select className="input-field" value={form.goal_category} onChange={(e) => update('goal_category', e.target.value)}>
            <option value="inventario">Inventario</option>
            <option value="equipo">Equipo</option>
            <option value="remodelacion">Remodelación</option>
          </select>
          <input className="input-field" type="number" placeholder="Meta MXN" value={form.funding_goal} onChange={(e) => update('funding_goal', e.target.value)} required />
          <input className="input-field" type="number" placeholder="Días de campaña" value={form.deadline_days} onChange={(e) => update('deadline_days', e.target.value)} required />
        </div>
        <textarea className="input-field w-full min-h-20" placeholder='Recompensas JSON (opcional): [{"tier":"Bronce","min":5000}]' value={form.reward_tiers_json} onChange={(e) => update('reward_tiers_json', e.target.value)} />
        {message && <div className="text-sm text-content-muted">{message}</div>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-3">{loading ? 'Guardando...' : 'Crear solicitud'}</button>
          <button type="button" onClick={() => onNavigate('pyme-dashboard')} className="btn-secondary px-6 py-3">Cancelar</button>
        </div>
      </form>
    </div>
  );
};
