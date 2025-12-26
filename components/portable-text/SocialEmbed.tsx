type SocialEmbedProps = {
  value: {
    platform: 'instagram' | 'facebook' | 'bluesky' | 'x';
    url: string;
    caption?: string;
  };
};

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  bluesky: 'Bluesky',
  x: 'X',
};

const PLATFORM_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  bluesky: '#0085FF',
  x: '#000000',
};

export default function SocialEmbed({ value }: SocialEmbedProps) {
  const platformLabel = PLATFORM_LABELS[value.platform] || value.platform;
  const platformColor = PLATFORM_COLORS[value.platform];

  return (
    <figure className="my-8">
      <div 
        className="p-6 border rounded-lg"
        style={{ 
          borderColor: 'var(--border)',
          backgroundColor: 'var(--muted-background, #fafafa)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-1 h-8 rounded"
            style={{ backgroundColor: platformColor }}
          />
          <div>
            <p 
              className="text-[0.875rem] font-medium uppercase tracking-wide"
              style={{ color: 'var(--muted)' }}
            >
              {platformLabel}
            </p>
            {value.caption && (
              <p 
                className="text-[0.9375rem] mt-1"
                style={{ color: 'var(--foreground)' }}
              >
                {value.caption}
              </p>
            )}
          </div>
        </div>
        
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[0.9375rem] font-medium hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent)' }}
        >
          View post
          <span style={{ fontSize: '0.875em' }}>→</span>
        </a>
      </div>
    </figure>
  );
}
