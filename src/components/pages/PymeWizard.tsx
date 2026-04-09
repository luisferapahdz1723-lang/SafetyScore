import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { View } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createBusiness, updateProfile } from '../../services/supabaseClient';
import { registerBusinessInNessie } from '../../services/nessieService';

interface PymeWizardProps {
  onNavigate: (view: View) => void;
}

export const PymeWizard: React.FC<PymeWizardProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  
  // Datos del form
  const [businessName, setBusinessName] = useState('');
  const [monthlySales, setMonthlySales] = useState('');

  const submitToDB = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let nCustId = undefined;
      let nAccId = undefined;
      try {
        // Enviar a Nessie 'bajo el agua'
        const  { customerId, accountId } = await registerBusinessInNessie(businessName, 'CDMX', 'CDMX');
        nCustId = customerId;
        nAccId = accountId;
      } catch (err) {
        console.error('Nessie sandbox limit / error, continuing...', err);
      }
      
      const sales = parseFloat(monthlySales.replace(/,/g, ''));
      await createBusiness({
        owner_id: user.id,
        name: businessName || 'Negocio Emprendedor',
        sector: 'Comercio',
        location_city: 'CDMX',
        location_state: 'CDMX',
        years_operating: 1,
        employees: 3,
        daily_sales: isNaN(sales) ? 1000 : sales / 30,
        fixed_costs: 8000,
        variable_costs: 15000,
        has_debts: false,
        debt_amount: 0,
        safety_score: 0,
        safety_sub_cashflow: 0,
        safety_sub_consistency: 0,
        safety_sub_return_probability: 0,
        safety_sub_sector: 0,
        trust_layer_analysis: 'Pendiente de evaluación de IA',
        status: 'evaluating'
      });

      if (nCustId || nAccId) {
        await updateProfile(user.id, {
          nessie_customer_id: nCustId,
          nessie_account_id: nAccId
        });
      }

      setIsSuccess(true);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      submitToDB();
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-20"
      >
        <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-blue/20">
          <CheckCircle2 size={48} className="text-brand-blue" />
        </div>
        <h1 className="text-5xl font-black text-content mb-6">¡Solicitud Enviada!</h1>
        <p className="text-xl text-content-muted mb-12 leading-relaxed">
          Hemos recibido los datos de tu negocio correctamente. Tu información está siendo evaluada para asignarte un <span className="font-bold text-primary">SafetyScore™</span>.
        </p>
        
        <div className="glass-panel rounded-2xl p-8 mb-12 text-left border-brand-blue/20 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-content-muted font-medium">
              <CheckCircle2 size={24} className="text-primary" />
              <span>Tiempo estimado de revisión: 24 a 48 horas hábiles.</span>
            </div>
            <div className="flex items-center gap-3 text-content-muted font-medium">
              <CheckCircle2 size={24} className="text-primary" />
              <span>Te notificaremos por correo cuando tu perfil esté listo.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onNavigate('pyme-dashboard')}
            className="btn-primary py-5 text-xl rounded-xl"
          >
            Ir a mi Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-content leading-tight">
              ¿Cuál es la razón social o nombre de tu negocio?
            </h2>
            <div className="relative mt-12">
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Distribuidora El Trébol" 
                className="w-full text-4xl font-bold bg-transparent border-b-2 border-slate-300 focus:border-brand-blue placeholder:text-slate-200 outline-none py-4 transition-colors"
                autoFocus
              />
            </div>
            <p className="text-slate-400 text-lg mt-8">
              Utiliza el nombre comercial por el cual te conocen tus clientes.
            </p>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-content leading-tight">
              ¿Cuánto facturaste en promedio cada mes el año pasado?
            </h2>
            <div className="relative flex items-center mt-12">
              <span className="text-5xl font-bold text-slate-300 mr-4">$</span>
              <input 
                type="text" 
                value={monthlySales}
                onChange={(e) => setMonthlySales(e.target.value)}
                placeholder="0.00" 
                className="w-full text-5xl font-bold bg-transparent border-b-2 border-slate-300 focus:border-brand-blue placeholder:text-slate-200 outline-none py-4 transition-colors"
                autoFocus
              />
            </div>
            <p className="text-slate-400 text-lg mt-8">
              Añade un estimado mensual. SafetyScore validará la cifra real con tus fuentes de datos bancarios para garantizar precisión al fondeador.
            </p>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-content leading-tight mb-12">
              ¿Cuál es el destino principal del capital?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Ampliación de Inventario', 'Remodelación de Sucursal', 'Adquisición de Maquinaria', 'Capital de Trabajo Múltiple'].map((option) => (
                <button 
                  key={option}
                  className="p-8 text-left rounded-2xl border border-border hover:border-brand-blue hover:bg-brand-blue/5 hover:shadow-lg transition-all group bg-white"
                >
                  <div className="text-xl font-bold text-content group-hover:text-brand-blue">{option}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mb-8 border border-brand-blue/20">
              <CheckCircle2 size={48} className="text-brand-blue" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-content leading-tight">
              Revisión Final
            </h2>
            <p className="text-xl text-content-muted leading-relaxed">
              Al procesar la solicitud, nuestro equipo especializado evaluará tu actividad para calcular el <span className="font-bold text-primary">SafetyScore™</span> y conectar tu negocio con posibles fondeadores.
            </p>
            <div className="p-8 rounded-2xl bg-surface border border-border/50 shadow-sm mt-8">
              <div className="flex items-start gap-4">
                <input type="checkbox" className="mt-1 w-6 h-6 accent-brand-blue cursor-pointer" id="terms" />
                <label htmlFor="terms" className="text-base font-medium text-slate-600 leading-relaxed cursor-pointer">
                  Acepto los términos y condiciones de la plataforma y declaro que la información proporcionada sobre mi negocio es válida y verídica.
                </label>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col max-w-4xl mx-auto">
      <div className="mb-20 pt-16">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-brand-blue uppercase tracking-widest">Paso {step} de {totalSteps}</span>
          <span className="text-sm font-bold text-content-muted">{Math.round((step / totalSteps) * 100)}% completado</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-blue"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto mb-16 flex items-center gap-6 pt-12">
        {step > 1 && (
          <button 
            onClick={() => setStep(s => s - 1)}
            className="p-5 rounded-xl border border-slate-300 text-content-muted hover:text-brand-blue hover:bg-slate-50 transition-all bg-white"
          >
            <ArrowLeft size={28} />
          </button>
        )}
        <button 
          onClick={handleNext}
          disabled={loading}
          className="flex-1 py-5 text-xl font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : (step === totalSteps ? 'Enviar Solicitud' : 'Continuar con el proceso')}
          {!loading && <ArrowRight size={24} />}
        </button>
      </div>
    </div>
  );
};
