import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Download, CheckCircle2, Clock,
  AlertTriangle, Eye, ChevronRight, Shield, Calendar
} from 'lucide-react';

const CONTRACTS = [
  {
    id: 'CNT-2026-001',
    negocio: 'Ferretería El Clavo',
    sector: 'Ferretería',
    monto: 40000,
    plazo: 6,
    mensualidad: 7200,
    fechaInicio: '15 Ene 2026',
    fechaFin: '15 Jul 2026',
    pagosRealizados: 3,
    totalPagos: 6,
    status: 'activo',
    roi: 21.3,
    score: 91,
  },
  {
    id: 'CNT-2026-002',
    negocio: 'Abarrotes Doña María',
    sector: 'Abarrotes',
    monto: 25000,
    plazo: 6,
    mensualidad: 4562,
    fechaInicio: '01 Feb 2026',
    fechaFin: '01 Ago 2026',
    pagosRealizados: 2,
    totalPagos: 6,
    status: 'activo',
    roi: 19.5,
    score: 88,
  },
  {
    id: 'CNT-2026-003',
    negocio: 'Taller Mecánico Rápido',
    sector: 'Automotriz',
    monto: 30000,
    plazo: 8,
    mensualidad: 4125,
    fechaInicio: '10 Feb 2026',
    fechaFin: '10 Oct 2026',
    pagosRealizados: 2,
    totalPagos: 8,
    status: 'activo',
    roi: 17.9,
    score: 82,
  },
  {
    id: 'CNT-2026-004',
    negocio: 'Restaurante La Paloma',
    sector: 'Alimentos',
    monto: 18000,
    plazo: 4,
    mensualidad: 4725,
    fechaInicio: '20 Mar 2026',
    fechaFin: '20 Jul 2026',
    pagosRealizados: 1,
    totalPagos: 4,
    status: 'alerta',
    roi: 16.2,
    score: 76,
  },
  {
    id: 'CNT-2025-012',
    negocio: 'Papelería Central',
    sector: 'Papelería',
    monto: 12000,
    plazo: 4,
    mensualidad: 3180,
    fechaInicio: '01 Sep 2025',
    fechaFin: '01 Ene 2026',
    pagosRealizados: 4,
    totalPagos: 4,
    status: 'completado',
    roi: 18.1,
    score: 85,
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  activo: { label: 'Activo', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={14} /> },
  alerta: { label: 'En revisión', color: 'bg-amber-100 text-amber-700', icon: <AlertTriangle size={14} /> },
  completado: { label: 'Completado', color: 'bg-slate-100 text-slate-600', icon: <CheckCircle2 size={14} /> },
};

export const InvestorContracts: React.FC = () => {
  const [selected, setSelected] = useState<typeof CONTRACTS[0] | null>(null);
  const [filter, setFilter] = useState<'todos' | 'activo' | 'alerta' | 'completado'>('todos');

  const filtered = filter === 'todos' ? CONTRACTS : CONTRACTS.filter(c => c.status === filter);

  const totalInvertido = CONTRACTS.filter(c => c.status !== 'completado').reduce((s, c) => s + c.monto, 0);
  const totalRecuperado = CONTRACTS.reduce((s, c) => s + (c.mensualidad * c.pagosRealizados), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-content mb-1">Mis Contratos</h1>
          <p className="text-content-muted">Documentos firmados, amortizaciones y estatus de pago</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-content-muted hover:text-brand-blue transition-all shadow-sm">
          <Download size={16} />
          Exportar todos
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Contratos activos', value: '4', sub: '+1 en revisión' },
          { label: 'Capital en juego', value: `$${totalInvertido.toLocaleString()}`, sub: 'Portafolio activo' },
          { label: 'Capital recuperado', value: `$${totalRecuperado.toLocaleString()}`, sub: 'Suma de mensualidades' },
          { label: 'Tasa de cumplimiento', value: '97%', sub: '58 de 60 pagos a tiempo' },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="text-2xl font-extrabold text-content mb-1">{k.value}</div>
            <div className="text-xs font-bold text-content mb-0.5">{k.label}</div>
            <div className="text-xs text-content-muted">{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Main content: list + detail */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Contract List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['todos', 'activo', 'alerta', 'completado'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === f ? 'bg-brand-blue text-white' : 'bg-white border border-slate-200 text-content-muted hover:text-brand-blue'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'activo' ? 'Activos' : f === 'alerta' ? 'En revisión' : 'Completados'}
              </button>
            ))}
          </div>

          {filtered.map((contract, i) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(contract)}
              className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md group ${
                selected?.id === contract.id ? 'border-brand-blue shadow-md' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-content">{contract.negocio}</p>
                  <p className="text-xs text-content-muted">{contract.sector} · {contract.id}</p>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${STATUS_CONFIG[contract.status].color}`}>
                  {STATUS_CONFIG[contract.status].icon}
                  {STATUS_CONFIG[contract.status].label}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-2">
                <div className="flex justify-between text-[10px] text-content-muted mb-1.5">
                  <span>Pago {contract.pagosRealizados} de {contract.totalPagos}</span>
                  <span>{Math.round((contract.pagosRealizados / contract.totalPagos) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-blue rounded-full"
                    style={{ width: `${(contract.pagosRealizados / contract.totalPagos) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs mt-3">
                <span className="font-bold text-content">${contract.monto.toLocaleString()}</span>
                <span className="text-emerald-600 font-bold">ROI {contract.roi}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contract Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm sticky top-6 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-content">{selected.negocio}</h2>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CONFIG[selected.status].color}`}>
                      {STATUS_CONFIG[selected.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-content-muted">{selected.sector} · Contrato {selected.id}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-slate-200 text-content-muted hover:text-brand-blue transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-xl border border-slate-200 text-content-muted hover:text-brand-blue transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Monto', value: `$${selected.monto.toLocaleString()}` },
                  { label: 'ROI anual', value: `${selected.roi}%` },
                  { label: 'SafetyScore', value: selected.score },
                  { label: 'Plazo', value: `${selected.plazo} meses` },
                  { label: 'Mensualidad', value: `$${selected.mensualidad.toLocaleString()}` },
                  { label: 'Pagos al día', value: `${selected.pagosRealizados}/${selected.totalPagos}` },
                ].map((s, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-content-muted mb-1">{s.label}</div>
                    <div className="text-lg font-extrabold text-content">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-bold text-content-muted uppercase tracking-widest mb-4">Calendario de Pagos</h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {Array.from({ length: selected.totalPagos }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1 ${i < selected.pagosRealizados ? '' : 'opacity-40'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        i < selected.pagosRealizados
                          ? 'bg-brand-blue border-brand-blue text-white'
                          : 'bg-white border-slate-300 text-content-muted'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-[9px] text-content-muted">M{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-content-muted mb-1">
                    <Calendar size={12} /> Inicio
                  </div>
                  <div className="text-sm font-bold text-content">{selected.fechaInicio}</div>
                </div>
                <div className="flex-1 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-content-muted mb-1">
                    <Calendar size={12} /> Vencimiento
                  </div>
                  <div className="text-sm font-bold text-content">{selected.fechaFin}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-brand-blue text-white rounded-xl font-semibold text-sm hover:bg-[#004A80] transition-colors">
                  Ver contrato PDF
                </button>
                <button className="flex-1 py-3 border border-slate-200 text-content-muted rounded-xl font-semibold text-sm hover:border-brand-blue hover:text-brand-blue transition-all">
                  Historial de pagos
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-64">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <FileText size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-bold text-content mb-2">Selecciona un contrato</p>
              <p className="text-sm text-content-muted">Elige uno de la lista para ver el detalle, estado de pagos y documentos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
