'use client';

import YouTubePlayer from '@/components/YouTubePlayer';
import { useChannels } from '@/hooks/useChannels';
import { Skeleton } from './ui/skeleton';

function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function ChannelGrid() {
  const { channels, isLoaded } = useChannels();

  if (!isLoaded) {
    return (
       <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
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
