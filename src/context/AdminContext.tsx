'use client';

import { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';

const ADMIN_PASSWORD = 'superadmin';
const STORAGE_KEY = 'isSuperAdmin';

type AdminContextType = {
  isAdmin: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Could not access localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (password: string) => {
      if (password === ADMIN_PASSWORD) {
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
          setIsAdmin(true);
          return true;
        } catch (error) {
          console.error('Could not access localStorage', error);
          return false;
        }
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setIsAdmin(false);
    } catch (error) {
      console.error('Could not access localStorage', error);
    }
  }, []);
  
  const value = useMemo(() => ({ isAdmin, isLoading, login, logout }), [isAdmin, isLoading, login, logout]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdminContext must be used within a AdminProvider');
    }
    return context;
}
