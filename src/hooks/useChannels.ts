'use client';

import { useContext } from 'react';
import { ChannelsContext } from '@/context/ChannelsContext';


export function useChannels() {
  const context = useContext(ChannelsContext);
  if (context === undefined) {
    throw new Error('useChannels must be used within a ChannelsProvider');
  }
  return context;
}
