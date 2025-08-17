'use client';

import { useContext } from 'react';
import { TheaterContext } from '@/context/TheaterContext';

export function useTheater() {
  const context = useContext(TheaterContext);
  if (context === undefined) {
    throw new Error('useTheater must be used within a TheaterProvider');
  }
  return context;
}
