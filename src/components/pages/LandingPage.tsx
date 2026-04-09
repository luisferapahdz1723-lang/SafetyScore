import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Store, Brain, Handshake } from 'lucide-react';
import { View, Role } from '../../types';

interface LandingPageProps {
  onNavigate: (view: View) => void;
  onNavigateToAuth: (role: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onNavigateToAuth }) => {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-emerald/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-emerald text-sm font-medium mb-6"
            >
              <ShieldCheck size={16} />
              <span>Regulado bajo principios LRITF</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-extrabold text-brand-blue mb-6 leading-[1.1]"
            >
              Tu negocio vale más que tu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-red">
                historial crediticio
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-content-muted max-w-2xl mx-auto mb-10"
            >
              SafetyScore conecta negocios reales con capital inteligente. 
              Medimos tu salud operativa en tiempo real para desbloquear tu potencial.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={() => onNavigateToAuth('pyme')}
                className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg"
              >
                Soy Negocio — Busco Inversión
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigateToAuth('investor')}
                className="btn-primary w-full sm:w-auto px-8 py-4 text-lg"
              >
                Soy Inversionista — Busco Oportunidades
                <TrendingUp size={20} />
              </button>
            </motion.div>
          </div>

          {/* Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="glass-panel rounded-3xl p-4 border-border shadow-3xl">
              <div className="bg-surface-alt rounded-2xl aspect-[16/9] overflow-hidden relative border border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent" />
                <div className="p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full" />
                      <div className="w-8 h-8 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 h-64 bg-slate-100 rounded-2xl" />
                    <div className="h-64 bg-slate-100 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-surface-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-brand-blue mb-4">Cómo Funciona</h2>
            <p className="text-content-muted">Tres pasos para transformar tu futuro financiero</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-brand-blue/10 via-brand-red/10 to-brand-blue/10 -translate-y-1/2 z-0" />
            
            {[
              { icon: <Store size={32} />, title: "Publica tu negocio", desc: "Sube tus datos operativos básicos en minutos.", color: "text-brand-blue" },
              { icon: <Brain size={32} />, title: "La IA evalúa tu salud", desc: "Nuestro analista virtual genera tu SafetyScore real.", color: "text-brand-emerald" },
              { icon: <Handshake size={32} />, title: "Recibe inversión directa", desc: "Conecta con fondeadores que creen en tu potencial.", color: "text-brand-red" }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 border border-border shadow-sm ${step.color}`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-2">{step.title}</h3>
                <p className="text-content-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Negocios Evaluados", value: "+500" },
              { label: "Capital Fondeado", value: "+$15M" },
              { label: "ROI Promedio", value: "18.5%" },
              { label: "Tiempo de Respuesta", value: "<24h" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-display font-extrabold text-brand-blue mb-2">{stat.value}</div>
                <div className="text-sm text-content-muted uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <span className="text-xl font-display font-bold text-brand-blue">SafetyScore</span>
          </div>
          <div className="flex gap-8 text-content-muted text-sm">
            <a href="#" className="hover:text-brand-blue transition-colors">Términos</a>
            <a href="#" className="hover:text-brand-blue transition-colors">Privacidad</a>
            <a href="#" className="hover:text-brand-blue transition-colors">Contacto</a>
          </div>
          <div className="text-content-muted text-xs">
            © 2026 SafetyScore Technologies. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
