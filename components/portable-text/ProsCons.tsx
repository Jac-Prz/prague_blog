type ProsConsProps = {
  value: {
    pros: string[];
    cons: string[];
  };
};

export default function ProsCons({ value }: ProsConsProps) {
  const { pros, cons } = value;

  return (
    <div 
      className="my-8 sm:my-10 grid sm:grid-cols-2 gap-5 sm:gap-6"
    >
      {/* Pros */}
      <div 
        className="p-5 sm:p-6 rounded-sm border"
        style={{ 
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <h4 className="text-[1.125rem] font-semibold mb-4 flex items-center gap-2" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)'
        }}>
          <span style={{ color: 'var(--accent)' }}>✓</span>
          Pros
        </h4>
        <ul className="space-y-2.5">
          {pros.map((pro, i) => (
            <li 
              key={i}
              className="flex gap-3 text-[0.875rem] sm:text-[0.9375rem] leading-[1.6]"
              style={{ color: 'var(--foreground)' }}
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '0.875em' }}>+</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div 
        className="p-5 sm:p-6 rounded-sm border"
        style={{ 
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <h4 className="text-[1.125rem] font-semibold mb-4 flex items-center gap-2" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)'
        }}>
          <span style={{ color: 'var(--muted)' }}>✗</span>
          Cons
        </h4>
        <ul className="space-y-2.5">
          {cons.map((con, i) => (
            <li 
              key={i}
              className="flex gap-3 text-[0.875rem] sm:text-[0.9375rem] leading-[1.6]"
              style={{ color: 'var(--foreground)' }}
            >
              <span style={{ color: 'var(--muted)', flexShrink: 0, fontSize: '0.875em' }}>−</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
