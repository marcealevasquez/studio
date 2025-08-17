import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYouTubeId(url: string): string | null {
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
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }
  return null;
}

export function getTwitchChannel(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('twitch.tv')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        return pathParts[0];
      }
    }
  } catch (error) {
    // Fallback for URLs without protocol
    const match = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}


export function getStreamSource(url: string): 'youtube' | 'twitch' | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('twitch.tv')) {
    return 'twitch';
  }
  return null;
}
