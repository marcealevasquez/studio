'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Channel } from '@/types';
import { INITIAL_CHANNELS } from '@/lib/channels';

const STORAGE_KEY = 'channels';

export function useChannels() {
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

  return { channels, addChannel, updateChannel, deleteChannel, isLoaded };
}
