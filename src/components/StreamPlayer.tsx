'use client';

import { getYouTubeId, getTwitchChannel, getStreamSource } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StreamPlayerProps {
  videoId: string;
  source: 'youtube' | 'twitch';
  title: string;
  smallPlayer?: boolean;
}

export default function StreamPlayer({
  videoId,
  source,
  title,
  smallPlayer,
}: StreamPlayerProps) {
  const [parent, setParent] = useState('');

  useEffect(() => {
    // The parent param is required by Twitch embeds.
    // It must be the domain of the parent window.
    if (typeof window !== 'undefined') {
      setParent(window.location.hostname);
    }
  }, []);
  
  const commonProps = {
    width: '100%',
    height: '100%',
    title: title,
    frameBorder: '0',
    allow:
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    allowFullScreen: true,
  };

  let src = '';
  if (source === 'youtube') {
    src = smallPlayer
      ? `https://www.youtube.com/embed/${videoId}?mute=1&loop=1&playlist=${videoId}&controls=0`
      : `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
  } else if (source === 'twitch' && parent) {
     src = `https://player.twitch.tv/?channel=${videoId}&parent=${parent}&autoplay=${!smallPlayer}&muted=true&controls=false`;
  }

  if (!src) {
    return (
       <div className="flex items-center justify-center w-full h-full bg-black rounded-lg">
        <p className="text-white">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden border rounded-lg shadow-lg aspect-video transition-all duration-300 hover:shadow-primary/20">
      <iframe
        {...commonProps}
        src={src}
        className="duration-500 animate-in fade-in"
      ></iframe>
    </div>
  );
}
