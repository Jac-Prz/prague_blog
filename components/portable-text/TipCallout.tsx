import { PortableText, PortableTextBlock } from '@portabletext/react';

type TipCalloutProps = {
  value: {
    variant: 'tip' | 'warning' | 'avoid' | 'logistics';
    title?: string;
    content: PortableTextBlock[];
  };
};

const variants = {
  tip: {
    emoji: '💡',
    label: 'Tip',
    bgColor: 'rgba(166, 77, 77, 0.05)',
    borderColor: 'rgba(166, 77, 77, 0.2)',
  },
  warning: {
    emoji: '⚠️',
    label: 'Warning',
    bgColor: 'rgba(212, 175, 55, 0.05)',
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  avoid: {
    emoji: '🚫',
    label: 'Avoid',
    bgColor: 'rgba(180, 83, 83, 0.05)',
    borderColor: 'rgba(180, 83, 83, 0.2)',
  },
  logistics: {
    emoji: '📋',
    label: 'Logistics',
    bgColor: 'rgba(100, 100, 100, 0.05)',
    borderColor: 'rgba(100, 100, 100, 0.2)',
  },
};

export default function TipCallout({ value }: TipCalloutProps) {
  const { variant, title, content } = value;
  const style = variants[variant] || variants.tip;

  return (
    <div 
      className="my-6 sm:my-8 p-4 sm:p-5 rounded-sm border-l-4"
      style={{ 
        backgroundColor: style.bgColor,
        borderLeftColor: style.borderColor,
        borderTop: `1px solid ${style.borderColor}`,
        borderRight: `1px solid ${style.borderColor}`,
        borderBottom: `1px solid ${style.borderColor}`,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5">{style.emoji}</span>
        <div className="flex-1">
          {title && (
            <h4 className="text-[0.9375rem] font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              {title}
            </h4>
          )}
          <div className="text-[0.9375rem] leading-[1.65]" style={{ color: 'var(--foreground)' }}>
            <PortableText 
              value={content}
              components={{
                block: {
                  normal: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                },
                marks: {
                  strong: ({children}) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                  em: ({children}) => <em>{children}</em>,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
