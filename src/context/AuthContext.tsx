import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

const SESSION_KEY = 'converxus_session';

export interface PlatformUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

/** Usuarios registrados en la plataforma. El correo se compara en minúsculas. */
export const USERS: PlatformUser[] = [
  {
    email: 'comercial@converxus.com',
    password: 'Converxus2026*',
    name: 'Equipo Comercial Converxus',
    role: 'Comercial',
  },
  {
    email: 'coordinacionproyectos@flowchem.com.co',
    password: 'Converxus2026*',
    name: 'Liliana Palacio',
    role: 'Coordinadora de proyectos y mantenimiento industrial',
  },
];

interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function findUser(email: string | null): PlatformUser | null {
  if (!email) return null;
  return USERS.find((u) => u.email === email.trim().toLowerCase()) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    return findUser(stored) ? stored : null;
  });

  const login = useCallback((email: string, password: string) => {
    const user = findUser(email);
    if (user && password === user.password) {
      localStorage.setItem(SESSION_KEY, user.email);
      setUserEmail(user.email);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUserEmail(null);
  }, []);

  const userName = findUser(userEmail)?.name ?? null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: userEmail !== null,
        userEmail,
        userName,
        login,
        logout,
      }}
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
