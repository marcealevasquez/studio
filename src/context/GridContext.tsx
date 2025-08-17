'use client';

import { createContext, useState, useEffect, useMemo } from 'react';

type GridSize = '2x2' | '3x3' | '4x4' | '5x5';
type GridContextType = {
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
};

const GRID_STORAGE_KEY = 'gridSize';

export const GridContext = createContext<GridContextType | undefined>(undefined);

export function GridProvider({ children }: { children: React.ReactNode }) {
  const [gridSize, setGridSize] = useState<GridSize>('3x3');

  useEffect(() => {
    try {
      const storedSize = localStorage.getItem(GRID_STORAGE_KEY) as GridSize | null;
      if (storedSize && ['2x2', '3x3', '4x4', '5x5'].includes(storedSize)) {
        setGridSize(storedSize);
      }
    } catch (error) {
        console.error('Could not access localStorage', error);
    }
  }, []);

  const handleSetGridSize = (size: GridSize) => {
    setGridSize(size);
    try {
        localStorage.setItem(GRID_STORAGE_KEY, size);
    } catch (error) {
        console.error('Could not access localStorage', error);
    }
  };

  const value = useMemo(() => ({ gridSize, setGridSize: handleSetGridSize }), [gridSize]);

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}
