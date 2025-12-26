// Centralized site metadata configuration

export const siteConfig = {
  name: 'Practical Prague',
  description: 'Honest advice for visiting Prague — from an expat who lives here.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://practicalprague.com',
  ogImage: '/og-image.png', // Default OG image (create this in /public)
  author: 'Practical Prague',
  locale: 'en_US',
  type: 'website',
};

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Prague', 'travel guide', 'Prague restaurants', 'Prague neighborhoods', 'Czech Republic', 'travel tips'],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};
