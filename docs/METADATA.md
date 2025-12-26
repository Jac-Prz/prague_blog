# Metadata Implementation Guide

## Overview

This project uses Next.js App Router's built-in metadata system with centralized configuration for SEO optimization, social sharing, and search engine crawlability.

## Architecture

### Centralized Configuration

All site-wide metadata is defined in `lib/metadata.ts`:

```typescript
export const siteConfig = {
  name: 'Practical Prague',
  description: 'Honest advice for visiting Prague — from an expat who lives here.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://practicalprague.com',
  ogImage: '/og-image.png',
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
  // ... OpenGraph, Twitter Card, robots configuration
};
```

### Root Layout Application

The root layout (`app/layout.tsx`) applies default metadata site-wide:

```typescript
export const metadata: Metadata = defaultMetadata;
```

## Page-Specific Metadata

### Article Pages

Article pages (`app/(site)/articles/[slug]/page.tsx`) use `generateMetadata()` to create dynamic metadata with a fallback strategy:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt;
  const ogImage = ogImageSource 
    ? urlFor(ogImageSource).width(1200).height(630).url()
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    // ... OpenGraph, Twitter Card, robots
  };
}
```

#### Fallback Strategy

1. **metaTitle**: Uses `post.seo.metaTitle` if available, otherwise falls back to `post.title`
2. **metaDescription**: Uses `post.seo.metaDescription`, falls back to `post.excerpt`
3. **ogImage**: Prioritizes `post.seo.ogImage`, then `post.featuredImage`, finally default site image

This ensures graceful degradation when editors don't fill in all SEO fields.

## Sanity SEO Configuration

### Post Schema SEO Object

Posts have a nested `seo` object in the schema (`sanity/schemaTypes/postType.ts`):

```typescript
defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => 
        Rule.required()
          .max(60)
          .custom((metaTitle, context) => {
            const title = (context.document as any)?.title;
            if (metaTitle === title) {
              return 'Meta title should be different from the post title';
            }
            return true;
          }),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      validation: (Rule) => 
        Rule.required()
          .min(150)
          .max(160),
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'If not set, featured image will be used',
    },
    {
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this post',
    },
  ],
})
```

### Validation Rules

- **metaTitle**: Required, max 60 characters, must differ from post title
- **metaDescription**: Required, 150-160 characters
- **ogImage**: Optional (falls back to featured image)
- **noIndex**: Optional boolean for controlling search indexing

## Metadata Tags Included

### Essential SEO Tags

- `<title>` - Dynamic with template
- `<meta name="description">` - From metaDescription
- `<link rel="canonical">` - Prevents duplicate content issues
- `<meta name="robots">` - Controls crawling/indexing

### Open Graph (Facebook, LinkedIn)

- `og:type` - "article" for posts, "website" for pages
- `og:url` - Canonical URL
- `og:title` - From metaTitle
- `og:description` - From metaDescription
- `og:image` - 1200x630px optimized image
- `og:locale` - Set to "en_US"
- `og:site_name` - "Practical Prague"
- `article:published_time` - Post publish date
- `article:author` - Author name

### Twitter Card

- `twitter:card` - "summary_large_image"
- `twitter:title` - From metaTitle
- `twitter:description` - From metaDescription
- `twitter:image` - Same as OG image

### Robots Configuration

```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

Posts with `seo.noIndex = true` override this with:

```typescript
robots: {
  index: false,
  follow: false,
}
```

## Canonical URLs

Canonical URLs are automatically generated using `metadataBase`:

```typescript
metadataBase: new URL(siteConfig.url)
```

Article pages explicitly set canonical:

```typescript
alternates: {
  canonical: `${siteConfig.url}/articles/${slug}`,
}
```

This prevents duplicate content issues if the site is accessible via multiple domains.

## Sitemap Generation

The site includes automatic sitemap generation (`app/sitemap.ts`):

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  
  const postEntries = posts.map((post) => ({
    url: `${siteConfig.url}/articles/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...postEntries];
}
```

Available at `/sitemap.xml`.

## Robots.txt

The site includes a robots.txt file (`app/robots.ts`):

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/studio/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

Available at `/robots.txt`.

## Structured Data

Article pages include Schema.org structured data (`lib/structured-data.ts`):

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "author": {
    "@type": "Organization",
    "name": "Practical Prague"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Practical Prague",
    "logo": {
      "@type": "ImageObject",
      "url": "https://site.com/og-image.png"
    }
  },
  "image": "https://site.com/image.jpg",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://site.com/articles/slug"
  }
}
```

### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://site.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Eat & Drink",
      "item": "https://site.com/eat-drink"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://site.com/articles/slug"
    }
  ]
}
```

Both schemas are injected as JSON-LD in article pages.

## Image Optimization

### OG Image Requirements

- **Dimensions**: 1200x630px (1.91:1 aspect ratio)
- **Format**: PNG or JPG
- **Size**: < 1MB for fast loading
- **Content**: Should be readable at small sizes

### Image URLs

Images from Sanity are automatically optimized using `urlFor()`:

```typescript
const ogImage = post.featuredImage 
  ? urlFor(post.featuredImage).width(1200).height(630).url()
  : `${siteConfig.url}${siteConfig.ogImage}`;
```

## Environment Variables

Required environment variable:

```bash
NEXT_PUBLIC_SITE_URL=https://practicalprague.com
```

Used for:
- `metadataBase` in Next.js
- Canonical URLs
- Sitemap URLs
- Structured data
- Social sharing previews

## Testing Metadata

### Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Testing Checklist

- [ ] Titles are 50-60 characters
- [ ] Descriptions are 150-160 characters
- [ ] OG images display correctly at 1200x630
- [ ] Canonical URLs are correct
- [ ] Structured data validates without errors
- [ ] Sitemap includes all public pages
- [ ] robots.txt blocks admin routes

## Common Issues & Solutions

### Issue: OG image not updating on social platforms

**Solution**: Social platforms cache OG images. Use their debugging tools to force a refresh:
- Facebook: Paste URL into Sharing Debugger and click "Scrape Again"
- Twitter: Wait 7 days or use a query parameter workaround

### Issue: Metadata not appearing in browser

**Solution**: Check that `generateMetadata()` is:
1. Async function
2. Returns a `Metadata` object
3. Placed in the correct file (page.tsx)

### Issue: Title template not working

**Solution**: Ensure root layout exports `metadata` with title.template:

```typescript
export const metadata = {
  title: {
    template: '%s | Site Name',
  },
};
```

## Best Practices

1. **Keep titles concise**: Aim for 50-60 characters
2. **Write compelling descriptions**: 150-160 characters that encourage clicks
3. **Use unique metadata**: Every page should have unique title/description
4. **Test on mobile**: Preview how cards appear on mobile social apps
5. **Include keywords naturally**: But avoid keyword stuffing
6. **Update OG images**: Consider creating custom images for important posts
7. **Monitor performance**: Use Google Search Console to track impressions/clicks
8. **Validate structured data**: Regularly check for schema errors

## Future Enhancements

- Add breadcrumb UI component to match structured data
- Implement `dateModified` tracking for articles
- Add author schema with detailed profiles
- Consider FAQ schema for how-to guides
- Add event schema for time-sensitive content
- Implement video schema for YouTube embeds
