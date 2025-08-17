interface YouTubePlayerProps {
  videoId: string;
  title: string;
  smallPlayer?: boolean;
}

export default function YouTubePlayer({ videoId, title, smallPlayer }: YouTubePlayerProps) {
  const commonProps = {
    width: "100%",
    height: "100%",
    title: title,
    frameBorder: "0",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true,
  };

  const src = smallPlayer
    ? `https://www.youtube.com/embed/${videoId}?mute=1&loop=1&playlist=${videoId}&controls=0`
    : `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-lg transition-all duration-300 hover:shadow-primary/20">
      <iframe
        {...commonProps}
        src={src}
        className="animate-in fade-in duration-500"
      ></iframe>
    </div>
  );
}
