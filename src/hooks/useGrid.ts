'use client';

import { useContext } from 'react';
import { GridContext } from '@/context/GridContext';

export function useGrid() {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
}
