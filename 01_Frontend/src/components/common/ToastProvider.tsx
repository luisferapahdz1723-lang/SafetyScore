import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  warning: <AlertTriangle size={18} className="text-amber-500" />,
  info: <Info size={18} className="text-brand-blue" />,
};

const BORDERS: Record<ToastType, string> = {
  success: 'border-l-4 border-emerald-500',
  warning: 'border-l-4 border-amber-500',
  info: 'border-l-4 border-brand-blue',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`bg-white rounded-xl shadow-xl p-4 flex items-start gap-3 ${BORDERS[toast.type]}`}
            >
              <div className="mt-0.5 flex-shrink-0">{ICONS[toast.type]}</div>
              <p className="text-sm font-medium text-content flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="flex-shrink-0 text-slate-400 hover:text-content transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
