type PlaceCardProps = {
  value: {
    name: string;
    category?: string;
    neighborhood?: string;
    price?: string;
    whyGo: string;
    whatToGet?: string;
    practical?: string[];
    mapLink?: string;
  };
};

export default function PlaceCard({ value }: PlaceCardProps) {
  const { name, category, neighborhood, price, whyGo, whatToGet, practical, mapLink } = value;

  return (
    <div 
      className="my-8 sm:my-10 p-5 sm:p-6 rounded-sm border"
      style={{ 
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card-bg)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-[1.25rem] sm:text-[1.375rem] font-semibold leading-tight mb-1" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)'
          }}>
            {name}
          </h3>
          <div className="flex items-center gap-2 text-[0.875rem]" style={{ color: 'var(--muted)' }}>
            {neighborhood && <span>{neighborhood}</span>}
            {neighborhood && (category || price) && <span>•</span>}
            {category && <span className="capitalize">{category}</span>}
            {price && (
              <>
                <span>•</span>
                <span>{price}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Why Go */}
      <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-3" style={{ color: 'var(--foreground)' }}>
        {whyGo}
      </p>

      {/* What to Get */}
      {whatToGet && (
        <div className="mb-3">
          <span className="text-[0.875rem] font-semibold" style={{ color: 'var(--muted)' }}>What to get: </span>
          <span className="text-[0.875rem]" style={{ color: 'var(--foreground)' }}>{whatToGet}</span>
        </div>
      )}

      {/* Practical Info */}
      {practical && practical.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {practical.map((info, i) => (
            <span 
              key={i}
              className="text-[0.8125rem] px-2 py-1 rounded-sm"
              style={{ 
                backgroundColor: 'var(--background)',
                color: 'var(--muted)',
                border: '1px solid var(--border)'
              }}
            >
              {info}
            </span>
          ))}
        </div>
      )}

      {/* Map Link */}
      {mapLink && (
        <a 
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[0.875rem] font-medium hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent)' }}
        >
          View on map →
        </a>
      )}
    </div>
  );
}
