import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (first_name: string, last_name: string, email: string, password: string, confirm_password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.profile();
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
  };

  const register = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    confirm_password: string
  ) => {
    const { data } = await authAPI.register({ first_name, last_name, email, password, confirm_password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
  };

  const logout = () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) authAPI.logout(refresh).catch(() => {});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
