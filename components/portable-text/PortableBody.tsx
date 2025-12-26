import { PortableText, PortableTextComponents, PortableTextBlock } from '@portabletext/react';
import PlaceCard from './PlaceCard';
import TipCallout from './TipCallout';
import QuickSummary from './QuickSummary';
import ProsCons from './ProsCons';
import YouTubeEmbed from './YouTubeEmbed';
import SocialEmbed from './SocialEmbed';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

type PortableBodyProps = {
  value: PortableTextBlock[];
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[1rem] sm:text-[1.0625rem] leading-[1.75]" style={{ color: 'var(--foreground)' }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 
        className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] font-semibold mt-12 mb-4 leading-[1.3]"
        style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.02em'
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 
        className="text-[1.25rem] sm:text-[1.375rem] md:text-[1.5rem] font-semibold mt-10 mb-3 leading-[1.3]"
        style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.02em'
        }}
      >
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 space-y-2 pl-6" style={{ listStyleType: 'disc' }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 space-y-2 pl-6" style={{ listStyleType: 'decimal' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[1rem] sm:text-[1.0625rem] leading-[1.75] pl-2" style={{ color: 'var(--foreground)' }}>
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[1rem] sm:text-[1.0625rem] leading-[1.75] pl-2" style={{ color: 'var(--foreground)' }}>
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600, color: 'var(--foreground)' }}>{children}</strong>
    ),
    em: ({ children }) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
    link: ({ value, children }) => {
      const { href, blank } = value || {};
      
      if (!href) {
        return <>{children}</>;
      }

      const target = blank ? '_blank' : undefined;
      const rel = blank ? 'noopener noreferrer' : undefined;

      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="link-hover transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      return (
        <figure className="my-8 sm:my-10">
          <div className="relative w-full aspect-video overflow-hidden rounded-sm">
            <Image
              src={urlFor(value).width(1200).height(750).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 832px"
            />
          </div>
          {value.caption && (
            <figcaption 
              className="mt-3 text-[0.875rem] text-center italic"
              style={{ color: 'var(--muted)' }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    place: PlaceCard,
    practicalTip: TipCallout,
    quickSummary: QuickSummary,
    prosCons: ProsCons,
    youtubeEmbed: YouTubeEmbed,
    socialEmbed: SocialEmbed,
  },
};

export default function PortableBody({ value }: PortableBodyProps) {
  return (
    <div className="portable-text">
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
