'use client';

import { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import type { Channel } from '@/types';
import { INITIAL_CHANNELS } from '@/lib/channels';

const STORAGE_KEY = 'channels';

type ChannelsContextType = {
  channels: Channel[];
  isLoaded: boolean;
  addChannel: (channel: Omit<Channel, 'id'>) => void;
  updateChannel: (updatedChannel: Channel) => void;
  deleteChannel: (id: string) => void;
};

export const ChannelsContext = createContext<ChannelsContextType | undefined>(undefined);

export function ChannelsProvider({ children }: { children: React.ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedChannels = localStorage.getItem(STORAGE_KEY);
      if (storedChannels) {
        setChannels(JSON.parse(storedChannels));
      } else {
        setChannels(INITIAL_CHANNELS);
      }
    } catch (error) {
      console.error('Could not access localStorage', error);
      setChannels(INITIAL_CHANNELS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
      } catch (error) {
        console.error('Could not access localStorage', error);
      }
    }
  }, [channels, isLoaded]);

  const addChannel = useCallback((channel: Omit<Channel, 'id'>) => {
    setChannels((prev) => [
      ...prev,
      { ...channel, id: new Date().toISOString() },
    ]);
  }, []);

  const updateChannel = useCallback((updatedChannel: Channel) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === updatedChannel.id ? updatedChannel : c))
    );
  }, []);

  const deleteChannel = useCallback((id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo(() => ({ channels, isLoaded, addChannel, updateChannel, deleteChannel }), [channels, isLoaded, addChannel, updateChannel, deleteChannel]);

  return <ChannelsContext.Provider value={value}>{children}</ChannelsContext.Provider>;
}

export function useChannelsContext() {
    const context = useContext(ChannelsContext);
    if (context === undefined) {
        throw new Error('useChannelsContext must be used within a ChannelsProvider');
    }
    return context;
}
