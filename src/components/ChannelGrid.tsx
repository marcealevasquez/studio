'use client';

import YouTubePlayer from '@/components/YouTubePlayer';
import { useChannels } from '@/hooks/useChannels';
import { useGrid } from '@/hooks/useGrid';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { useTheater } from '@/hooks/useTheater';
import { Channel } from '@/types';

function getYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }
      const paths = urlObj.pathname.split('/');
      if (paths[1] === 'embed') {
        return paths[2];
      }
    }
  } catch (error) {
    // Fallback for invalid URLs
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }
  return null;
}

export default function ChannelGrid() {
  const { channels, isLoaded } = useChannels();
  const { gridSize } = useGrid();
  const { isTheaterMode, mainChannel, setMainChannel, toggleTheaterMode } = useTheater();

  const gridClasses = {
    '2x2': 'grid-cols-2',
    '3x3': 'grid-cols-3',
    '4x4': 'grid-cols-4',
    '5x5': 'grid-cols-5',
  };
  
  const handleChannelClick = (channel: Channel) => {
    if (isTheaterMode) {
      setMainChannel(channel);
    } else {
       setMainChannel(channel);
       toggleTheaterMode();
    }
  };

  if (!isLoaded) {
    return (
       <div className={cn('grid gap-2 p-2', gridClasses[gridSize])}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (isTheaterMode) {
    const currentMainChannel = mainChannel || channels[0];
    if (!currentMainChannel) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>No hay canales disponibles.</p>
            </div>
        )
    }

    const otherChannels = channels.filter((c) => c.id !== currentMainChannel.id);
    const mainVideoId = getYouTubeId(currentMainChannel.url);
    
    return (
      <div className="flex flex-col p-2">
        <div className="mb-2">
            {mainVideoId && <YouTubePlayer videoId={mainVideoId} title={currentMainChannel.name} />}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
            {otherChannels.map((channel) => {
                const videoId = getYouTubeId(channel.url);
                if (!videoId) return null;
                return (
                    <div key={channel.id} className="flex flex-col gap-1.5">
                        <div className="cursor-pointer" onClick={() => handleChannelClick(channel)}>
                            <YouTubePlayer videoId={videoId} title={channel.name} smallPlayer/>
                        </div>
                        <a 
                          onClick={() => handleChannelClick(channel)}
                          className="text-center text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer truncate"
                        >
                            {channel.name}
                        </a>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-2 p-2', gridClasses[gridSize])}>
      {channels.map((channel) => {
        const videoId = getYouTubeId(channel.url);
        if (!videoId) return null;

        return (
          <div key={channel.id} className="group flex flex-col gap-2 cursor-pointer" onClick={() => handleChannelClick(channel)}>
            <YouTubePlayer videoId={videoId} title={channel.name} />
             <p className="text-center font-medium truncate group-hover:text-primary">{channel.name}</p>
          </div>
        );
      })}
    </div>
  );
}
