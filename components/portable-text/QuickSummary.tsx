type QuickSummaryProps = {
  value: {
    title?: string;
    bullets: string[];
  };
};

export default function QuickSummary({ value }: QuickSummaryProps) {
  const { title = 'In short', bullets } = value;

  return (
    <div 
      className="my-8 sm:my-10 p-5 sm:p-6 rounded-sm border"
      style={{ 
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card-bg)'
      }}
    >
      <h3 className="text-[1.125rem] sm:text-[1.25rem] font-semibold mb-4" style={{
        fontFamily: 'Georgia, serif',
        color: 'var(--foreground)'
      }}>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {bullets.map((bullet, i) => (
          <li 
            key={i}
            className="flex gap-3 text-[0.9375rem] sm:text-[1rem] leading-[1.65]"
            style={{ color: 'var(--foreground)' }}
          >
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
