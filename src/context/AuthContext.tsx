import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

const SESSION_KEY = 'converxus_demo_session';
export const DEMO_EMAIL = 'comercial@converxus.demo';
export const DEMO_PASSWORD = 'Converxus2026*';

interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY),
  );

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem(SESSION_KEY, DEMO_EMAIL);
      setUserEmail(DEMO_EMAIL);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUserEmail(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: userEmail !== null, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
