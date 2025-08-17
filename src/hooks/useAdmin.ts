'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = 'superadmin';
const STORAGE_KEY = 'isSuperAdmin';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
          router.push('/');
          return true;
        } catch (error) {
          console.error('Could not access localStorage', error);
          return false;
        }
      }
      return false;
    },
    [router]
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setIsAdmin(false);
      router.push('/');
    } catch (error) {
      console.error('Could not access localStorage', error);
    }
  }, [router]);

  return { isAdmin, isLoading, login, logout };
}
