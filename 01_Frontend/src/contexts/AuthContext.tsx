import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '../services/supabaseClient';

export interface AppUser {
  id: string;
  email: string;
  user_metadata?: { role?: string; full_name?: string };
}

export interface AppSession {
  access_token: string;
  user: AppUser;
  profile: Profile; // el perfil viaja dentro de la sesión → no hay fetch async
}

interface AuthContextType {
  user: AppUser | null;
  session: AppSession | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  refreshSession: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicialización sincrónica desde localStorage — sin fetch, sin race condition
  useEffect(() => {
    const stored = localStorage.getItem('app_session');
    if (stored) {
      try {
        const sess: AppSession = JSON.parse(stored);
        setSession(sess);
        setUser(sess.user);
        setProfile(sess.profile ?? null);
      } catch {
        localStorage.removeItem('app_session');
      }
    }
    setLoading(false);
  }, []);

  const refreshSession = async () => {
    const stored = localStorage.getItem('app_session');
    if (stored) {
      try {
        const sess: AppSession = JSON.parse(stored);
        setSession(sess);
        setUser(sess.user);
        setProfile(sess.profile ?? null);
      } catch {
        localStorage.removeItem('app_session');
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      refreshProfile: async () => { await refreshSession(); },
      refreshSession,
      signOut: async () => {
        localStorage.removeItem('app_session');
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
