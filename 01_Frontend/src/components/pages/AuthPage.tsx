import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { View, Role } from '../../types';
import { signIn } from '../../services/supabaseClient';

interface AuthPageProps {
  onNavigate: (view: View) => void;
  onLogin: (role: Role, isNewUser: boolean) => void;
  preselectedRole: Role;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, onLogin, preselectedRole }) => {
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await signIn(email, password);
      // El rol se detecta automáticamente desde el perfil en AuthContext
      // onLogin se llama para compatibilidad, el AuthContext maneja la redirección
      const userRole = (data.user?.user_metadata?.role as Role) || 'pyme';
      onLogin(userRole, false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="md:w-1/2 bg-surface-alt relative overflow-hidden flex flex-col justify-center p-12 lg:p-24 border-r border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-red/5 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10">
          <div 
            className="flex items-center gap-2 mb-12 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-white text-xl">S</div>
            <span className="text-2xl font-display font-bold text-brand-blue">SafetyScore</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-bold text-brand-blue mb-6 leading-tight">
            Bienvenido a <br />
            <span className="text-brand-emerald">SafetyScore™</span>
          </h1>
          <p className="text-lg text-content-muted mb-12 max-w-md">
            Ingresa con tus credenciales para acceder al marketplace de inversión inteligente.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-content-muted">
              <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-brand-emerald shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <span>Seguridad de grado bancario</span>
            </div>
            <div className="flex items-center gap-4 text-content-muted">
              <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-brand-blue shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <span>Verificación por IA en tiempo real</span>
            </div>
          </div>

          {/* Cuentas de prueba */}
          <div className="mt-12 p-6 rounded-2xl bg-white/50 border border-border">
            <p className="text-xs font-bold text-content-muted uppercase tracking-widest mb-3">Cuentas de Demostración</p>
            <div className="space-y-2 text-sm text-content-muted font-mono">
              <div><span className="text-brand-blue font-bold">Inversionista:</span> inversionista@test.com</div>
              <div><span className="text-brand-emerald font-bold">Negocio:</span> negocio@test.com</div>
              <div className="text-xs mt-2">Contraseña: <span className="font-bold">password123</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 bg-surface flex flex-col justify-center p-8 lg:p-24">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-display font-bold text-content mb-2">Iniciar Sesión</h2>
          <p className="text-content-muted mb-8">Ingresa tus credenciales para continuar.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm flex items-center gap-2 font-medium mb-4 border border-rose-100">
                <AlertTriangle size={16} />
                {errorMsg}
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={20} />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="input-field w-full pl-12" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={20} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                className="input-field w-full pl-12" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-4 disabled:opacity-50 transition-opacity">
              {loading ? 'Verificando...' : 'Entrar a SafetyScore'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
