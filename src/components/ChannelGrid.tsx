'use client';

import { useRef } from 'react';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useChannels } from '@/hooks/useChannels';
import { useGrid } from '@/hooks/useGrid';
import { cn, getYouTubeId } from '@/lib/utils';
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

  return (
    <div
      className={cn('p-2 transition-all duration-300 ease-in-out', {
        'flex flex-col': isTheaterMode,
      })}
    >
      <div
        className={cn({
          'mb-2': isTheaterMode,
        })}
      >
        {isTheaterMode && currentMainChannel && (
          <YouTubePlayer
            videoId={getYouTubeId(currentMainChannel.url)!}
            title={currentMainChannel.name}
          />
        )}
      </div>

      <div
        className={cn('transition-all duration-300 ease-in-out', {
          'grid gap-2': !isTheaterMode,
          [gridClasses[gridSize]]: !isTheaterMode,
          'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2':
            isTheaterMode,
        })}
      >
        {visibleChannels.map((channel) => {
          const videoId = getYouTubeId(channel.url);
          if (!videoId) return null;

          const isMain = currentMainChannel?.id === channel.id;
          if (isTheaterMode && isMain) return null;

          return (
            <div
              key={channel.id}
              className="group flex flex-col gap-2 cursor-pointer"
              draggable={!isTheaterMode}
              onDragStart={() => handleDragStart(channel)}
              onDragEnter={() => handleDragEnter(channel)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => handleChannelClick(channel)}
            >
              <YouTubePlayer
                videoId={videoId}
                title={channel.name}
                smallPlayer={isTheaterMode}
              />
              {isTheaterMode && (
                <p
                  className={cn(
                    'text-center font-medium truncate group-hover:text-primary',
                    {
                      'text-sm text-muted-foreground hover:text-primary':
                        isTheaterMode,
                    }
                  )}
                >
                  {channel.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
