/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LandingPage } from './components/pages/LandingPage';
import { AuthPage } from './components/pages/AuthPage';
import { PymeDashboard } from './components/pages/PymeDashboard';
import { PymeWizard } from './components/pages/PymeWizard';
import { InvestorMarketplace } from './components/pages/InvestorMarketplace';
import { OpportunityDetail } from './components/pages/OpportunityDetail';
import { InvestorPortfolio } from './components/pages/InvestorPortfolio';
import { InvestorAnalytics } from './components/pages/InvestorAnalytics';
import { InvestorAlerts } from './components/pages/InvestorAlerts';
import { InvestorContracts } from './components/pages/InvestorContracts';
import { CrowdfundingRequestForm } from './components/pages/CrowdfundingRequestForm';
import { PymeCrowdfundingRequests } from './components/pages/PymeCrowdfundingRequests';
import { CrowdfundingRequestDetail } from './components/pages/CrowdfundingRequestDetail';
import { Sidebar } from './components/organisms/Sidebar';
import { ToastProvider } from './components/common/ToastProvider';
import { View, Role, BusinessOpportunity } from './types';
import { useAuth } from './contexts/AuthContext';
import { CrowdfundingRequest } from './services/supabaseClient';

export default function App() {
  const { user, profile, loading, signOut, refreshSession } = useAuth();
  const role = (profile?.role as Role) || null;

  const [view, setView] = useState<View>('landing');
  const [preselectedRole, setPreselectedRole] = useState<Role>('pyme');
  const [selectedOpportunity, setSelectedOpportunity] = useState<BusinessOpportunity | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CrowdfundingRequest | null>(null);

  // Auto-navegación según el rol una vez que carga el perfil
  useEffect(() => {
    if (loading) return;
    
    if (user && role) {
      if (view === 'landing' || view === 'auth') {
        setView(role === 'pyme' ? 'pyme-dashboard' : 'investor-marketplace');
      }
    } else if (!user) {
      setView('landing');
    }
  }, [user, role, loading]);

  useEffect(() => {
    if (role === 'investor') {
      document.documentElement.setAttribute('data-theme', 'investor');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [role]);

  const handleNavigateToAuth = useCallback((selectedRole: Role) => {
    setPreselectedRole(selectedRole);
    setView('auth');
  }, []);

  const handleLogout = async () => {
    await signOut();
    setView('landing');
  };

  const handleSelectOpportunity = (opp: BusinessOpportunity) => {
    setSelectedOpportunity(opp);
    setView('opportunity-detail');
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={setView} onNavigateToAuth={handleNavigateToAuth} />;
      case 'auth':
        return <AuthPage onNavigate={setView} preselectedRole={preselectedRole} onLogin={async (role) => { await refreshSession(); setView(role === 'pyme' ? 'pyme-dashboard' : 'investor-marketplace'); }} />;
      case 'pyme-dashboard':
        return <PymeDashboard onNavigate={setView} />;
      case 'pyme-wizard':
        return <PymeWizard onNavigate={setView} />;
      case 'pyme-crowdfunding-new':
        return <CrowdfundingRequestForm onNavigate={setView} />;
      case 'pyme-crowdfunding-list':
        return <PymeCrowdfundingRequests onNavigate={setView} onSelectRequest={setSelectedRequest} />;
      case 'pyme-crowdfunding-detail':
        return <CrowdfundingRequestDetail onNavigate={setView} request={selectedRequest} />;
      case 'investor-marketplace':
        return <InvestorMarketplace onSelectOpportunity={handleSelectOpportunity} />;
      case 'opportunity-detail':
        return selectedOpportunity ? (
          <OpportunityDetail
            opportunity={selectedOpportunity}
            onBack={() => setView('investor-marketplace')}
          />
        ) : <InvestorMarketplace onSelectOpportunity={handleSelectOpportunity} />;
      case 'investor-portfolio':
        return <InvestorPortfolio onNavigate={setView} />;
      case 'investor-analytics':
        return <InvestorAnalytics onNavigate={setView} />;
      case 'investor-alerts':
        return <InvestorAlerts onNavigate={setView} />;
      case 'investor-contracts':
        return <InvestorContracts />;
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };

  const isDashboardView = role !== null && view !== 'landing' && view !== 'auth';

  return (
    <ToastProvider>
      <div className="min-h-screen">
        {isDashboardView ? (
          <motion.div
            key="dashboard"
            className="flex min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sidebar
              currentView={view}
              onNavigate={setView}
              role={role!}
              onLogout={handleLogout}
            />
            <main className="flex-1 ml-72 p-8 lg:p-12 min-h-screen overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </ToastProvider>
  );
}
