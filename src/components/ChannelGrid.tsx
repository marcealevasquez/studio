'use client';

import YouTubePlayer from '@/components/YouTubePlayer';
import { useChannels } from '@/hooks/useChannels';
import { useGrid } from '@/hooks/useGrid';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function ChannelGrid() {
  const { channels, isLoaded } = useChannels();
  const { gridSize } = useGrid();

  const gridClasses = {
    '2x2': 'grid-cols-2',
    '3x3': 'grid-cols-3',
    '4x4': 'grid-cols-4',
    '5x5': 'grid-cols-5',
  };

  if (!isLoaded) {
    return (
       <div className={cn('grid gap-2', gridClasses[gridSize])}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-2', gridClasses[gridSize])}>
      {channels.map((channel) => {
        const videoId = getYouTubeId(channel.url);
        if (!videoId) return null;

        return (
          <div key={channel.id} className="group flex flex-col gap-2">
            <YouTubePlayer videoId={videoId} title={channel.name} />
          </div>
        );
      })}
    </div>
  );
}
