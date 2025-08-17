'use client';

import { createContext, useState, useMemo, useContext, useCallback } from 'react';
import type { Channel } from '@/types';

type TheaterContextType = {
  isTheaterMode: boolean;
  mainChannel: Channel | null;
  toggleTheaterMode: () => void;
  setMainChannel: (channel: Channel) => void;
};

export const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

export function TheaterProvider({ children }: { children: React.ReactNode }) {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [mainChannel, setMainChannel] = useState<Channel | null>(null);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
    if (isTheaterMode) {
      setMainChannel(null); 
    }
  }, [isTheaterMode]);

  const value = useMemo(() => ({ isTheaterMode, mainChannel, toggleTheaterMode, setMainChannel }), [isTheaterMode, mainChannel, toggleTheaterMode]);

  return <TheaterContext.Provider value={value}>{children}</TheaterContext.Provider>;
}

export function useTheaterContext() {
    const context = useContext(TheaterContext);
    if (context === undefined) {
        throw new Error('useTheaterContext must be used within a TheaterProvider');
    }
    return context;
}
