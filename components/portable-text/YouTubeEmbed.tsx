type YouTubeEmbedProps = {
  value: {
    url: string;
    title?: string;
    caption?: string;
  };
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function YouTubeEmbed({ value }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(value.url);

  if (!videoId) {
    return (
      <div className="my-8 p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
        <p style={{ color: 'var(--muted)' }}>Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <figure className="my-8">
      <div 
        className="relative w-full overflow-hidden rounded"
        style={{ 
          paddingBottom: '56.25%', // 16:9 aspect ratio
          backgroundColor: 'var(--muted-background, #f5f5f5)',
        }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={value.title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full"
          style={{ border: 0 }}
        />
      </div>
      {value.caption && (
        <figcaption 
          className="mt-3 text-[0.875rem] text-center"
          style={{ color: 'var(--muted)' }}
        >
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
