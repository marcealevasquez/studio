'use client';

import { useRef } from 'react';
import StreamPlayer from '@/components/StreamPlayer';
import { useChannels } from '@/hooks/useChannels';
import { useGrid } from '@/hooks/useGrid';
import { cn, getYouTubeId, getTwitchChannel, getStreamSource } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { useTheater } from '@/hooks/useTheater';
import { Channel } from '@/types';

export default function ChannelGrid() {
  const { channels, isLoaded, reorderChannels } = useChannels();
  const { gridSize } = useGrid();
  const { isTheaterMode, mainChannel, setMainChannel, toggleTheaterMode } =
    useTheater();

  const draggedItem = useRef<Channel | null>(null);
  const dropTargetItem = useRef<Channel | null>(null);

  const gridClasses = {
    '2x2': 'grid-cols-2',
    '3x3': 'grid-cols-3',
    '4x4': 'grid-cols-4',
    '5x5': 'grid-cols-5',
  };

  const handleChannelClick = (channel: Channel) => {
    if (isTheaterMode) {
      if (channel.id === mainChannel?.id) return;
      setMainChannel(channel);
    } else {
      setMainChannel(channel);
      toggleTheaterMode();
    }
  };

  const handleDragStart = (channel: Channel) => {
    draggedItem.current = channel;
  };

  const handleDragEnter = (channel: Channel) => {
    dropTargetItem.current = channel;
  };

  const handleDragEnd = () => {
    if (draggedItem.current && dropTargetItem.current) {
      reorderChannels(draggedItem.current, dropTargetItem.current);
    }
    draggedItem.current = null;
    dropTargetItem.current = null;
  };

  const currentMainChannel = isTheaterMode ? mainChannel || channels.find(c => c.isVisible ?? true) : null;
  const visibleChannels = channels.filter(c => c.isVisible ?? true);

  if (!isLoaded) {
    return (
      <div className={cn('grid gap-2 p-2', gridClasses[gridSize])}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  const renderPlayer = (channel: Channel, smallPlayer = false) => {
    const source = getStreamSource(channel.url);
    const videoId = source === 'youtube' ? getYouTubeId(channel.url) : getTwitchChannel(channel.url);
    if (!videoId || !source) return null;

    return (
       <StreamPlayer
        videoId={videoId}
        source={source}
        title={channel.name}
        smallPlayer={smallPlayer}
      />
    );
  };
  
  if (isTheaterMode) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {currentMainChannel && renderPlayer(currentMainChannel, false)}

        <div className="grid grid-cols-6 gap-2">
          {visibleChannels.map((channel) => {
            const isMain = currentMainChannel?.id === channel.id;
            if (isMain) return null;

            return (
              <div
                key={channel.id}
                className="group flex cursor-pointer flex-col gap-2"
                onClick={() => handleChannelClick(channel)}
              >
                {renderPlayer(channel, true)}
                <p className="truncate text-center text-sm text-muted-foreground group-hover:text-primary">
                  {channel.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-2 p-2', gridClasses[gridSize])}>
      {visibleChannels.map((channel) => (
        <div
          key={channel.id}
          className="group flex cursor-pointer flex-col gap-2"
          draggable
          onDragStart={() => handleDragStart(channel)}
          onDragEnter={() => handleDragEnter(channel)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => handleChannelClick(channel)}
        >
          {renderPlayer(channel, false)}
        </div>
      ))}
    </div>
  );
}
