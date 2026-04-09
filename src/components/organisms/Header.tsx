import React from 'react';
import { Bell, Search, Calendar } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-brand-blue mb-1">{title}</h1>
        {subtitle && <p className="text-content-muted text-sm">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-content-muted text-sm bg-surface-alt px-4 py-2 rounded-xl border border-border shadow-sm">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 rounded-xl bg-surface-alt border border-border text-content-muted hover:text-brand-blue transition-all shadow-sm">
            <Search size={20} />
          </button>
          <button className="p-3 rounded-xl bg-surface-alt border border-border text-content-muted hover:text-brand-blue transition-all relative shadow-sm">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-brand-red rounded-full border-2 border-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
