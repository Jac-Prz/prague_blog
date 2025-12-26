# Technical Documentation — Practical Prague

## Overview

This document covers the technical architecture, data flow, and development patterns for the Practical Prague blog. For design specifications, see [DESIGN_DOCUMENTATION.md](./DESIGN_DOCUMENTATION.md).

**Tech Stack:**
- **Framework:** Next.js 16.1.1 (App Router with React Server Components)
- **CMS:** Sanity Studio 4.22.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Content Rendering:** @portabletext/react 6.0.0

---

## Folder Structure

```
prague_blog/
├── app/                                    # Next.js App Router
│   ├── globals.css                        # Global styles, CSS variables, theme
│   ├── layout.tsx                         # Root layout (html, body, suppressHydrationWarning)
│   ├── page.tsx                           # Legacy homepage redirect (if exists)
│   │
│   ├── (site)/                            # Route group - main blog
│   │   ├── layout.tsx                     # Site layout (header, nav, main wrapper)
│   │   ├── page.tsx                       # Homepage (hero, Start Here, Latest Articles)
│   │   ├── theme-toggle.tsx               # Client component - light/dark mode toggle
│   │   ├── mobile-nav.tsx                 # Client component - hamburger menu
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx                   # About page (editorial, minimal)
│   │   │
│   │   ├── eat-drink/
│   │   │   └── page.tsx                   # Category page - restaurants, cafés
│   │   │
│   │   ├── neighborhoods/
│   │   │   └── page.tsx                   # Category page - areas to stay
│   │   │
│   │   ├── things-to-do/
│   │   │   └── page.tsx                   # Category page - attractions
│   │   │
│   │   ├── practical-tips/
│   │   │   └── page.tsx                   # Category page - logistics
│   │   │
│   │   └── articles/
│   │       ├── page.tsx                   # All articles archive
│   │       └── [slug]/
│   │           └── page.tsx               # Individual article (dynamic route)
│   │
│   └── studio/                            # Route group - Sanity Studio (isolated)
│       ├── layout.tsx                     # Minimal layout (returns children only)
│       └── [[...tool]]/
│           └── page.tsx                   # Sanity Studio catch-all route
│
├── components/                            # Reusable React components
│   ├── ArticleList.tsx                    # Article list with empty state
│   └── portable-text/                     # Portable Text renderers
│       ├── PortableBody.tsx               # Main renderer with config
│       ├── PlaceCard.tsx                  # Place recommendation block
│       ├── TipCallout.tsx                 # Tip/warning/logistics callout
│       ├── QuickSummary.tsx               # Bullet summary block
│       └── ProsCons.tsx                   # Pros/cons comparison block
│
├── sanity/                                # Sanity CMS configuration
│   ├── env.ts                            # Environment variables helper
│   ├── structure.ts                       # Studio structure customization
│   ├── lib/
│   │   ├── client.ts                      # Sanity client configuration
│   │   ├── image.ts                       # Image URL builder (urlFor helper)
│   │   ├── live.ts                        # Live preview configuration
│   │   └── queries.ts                     # Type-safe GROQ query functions
│   │
│   └── schemaTypes/                       # Sanity schema definitions
│       ├── index.ts                       # Schema registry
│       ├── authorType.ts                  # Author schema
│       ├── categoryType.ts                # Category schema
│       ├── postType.ts                    # Post schema
│       └── blockContentType.ts            # Portable Text schema with custom blocks
│
├── public/                                # Static assets
│
├── docs/                                  # Documentation
│   ├── DESIGN_DOCUMENTATION.md            # Design system, UI/UX specs
│   └── TECHNICAL_DOCUMENTATION.md         # This file
│
├── sanity.types.ts                        # Generated TypeScript types (from TypeGen)
├── sanity-codegen.config.ts               # TypeGen configuration
├── sanity.config.ts                       # Sanity Studio config
├── sanity.cli.ts                          # Sanity CLI config
├── next.config.ts                         # Next.js config (Sanity CDN images)
├── tsconfig.json                          # TypeScript config
├── tailwind.config.ts                     # Tailwind config
├── postcss.config.mjs                     # PostCSS config
├── package.json                           # Dependencies and scripts
└── .env.local                             # Environment variables (not in git)
```

---

## Route Groups Architecture

Next.js App Router uses **route groups** to organize layouts without affecting URL structure.

### `(site)` Route Group

**Purpose:** Main blog with shared header, navigation, and theme toggle.

**Layout:** `app/(site)/layout.tsx`
- Returns a `<Fragment>` (not `<html>` or `<body>`)
- Includes:
  - Sticky header with nav
  - Main content wrapper (`max-w-[52rem]`)
  - Theme toggle (fixed position)
  - Mobile navigation component

**Pages:**
- `/` — Homepage
- `/about` — About page
- `/eat-drink`, `/neighborhoods`, `/things-to-do`, `/practical-tips` — Categories
- `/articles` — Archive
- `/articles/[slug]` — Individual articles

### `studio` Route Group

**Purpose:** Sanity Studio isolated from blog layout.

**Layout:** `app/studio/layout.tsx`
- Minimal — returns `children` only
- No header, no nav, no theme toggle
- Studio handles its own layout

**Route:**
- `/studio` — Sanity Studio admin interface
- Uses catch-all route: `[[...tool]]`

### Root Layout

**File:** `app/layout.tsx`

**Responsibility:**
- Returns `<html>` and `<body>` tags only
- Applies to **all** routes (both site and studio)
- Uses `suppressHydrationWarning` for theme class
- Minimal — delegates to route group layouts

---

## Sanity Schema (Models)

All schema types are defined in `sanity/schemaTypes/` and registered in `index.ts`.

### Author Schema

**File:** `sanity/schemaTypes/authorType.ts`

**Fields:**
```typescript
{
  name: string           // Author name (required)
  slug: slug             // URL-friendly slug (required)
  image: image           // Profile photo (optional)
  bio: blockContent      // Biography (optional)
}
```

**Usage:** Currently optional for posts, supports future multi-author content.

---

### Category Schema

**File:** `sanity/schemaTypes/categoryType.ts`

**Fields:**
```typescript
{
  title: string          // Category name (required)
  slug: slug             // URL slug (required)
  description: text      // Brief description (optional)
}
```

**Current Categories:**
- `eat-drink` — Eat & Drink
- `neighborhoods` — Neighborhoods
- `things-to-do` — Things to Do
- `practical-tips` — Practical Tips

**Usage:** Posts must have 1-2 category references.

---

### Post Schema

**File:** `sanity/schemaTypes/postType.ts`

**Core Fields:**
```typescript
{
  title: string                  // Post title (required)
  slug: slug                     // URL slug (required, auto-generated from title)
  excerpt: text                  // 1-2 sentence summary (required, max 200 chars)
  author: reference              // Reference to author (optional)
  mainImage: image               // Legacy main image (optional)
  categories: array<reference>   // 1-2 category references (required)
  featured: boolean              // Show in "Start Here" (default: false)
  publishedAt: datetime          // Publication date (required)
  body: blockContent             // Article content (required)
}
```

**Metadata Fields (SEO):**
```typescript
{
  metaTitle: string              // SEO title (optional, defaults to title, max 60 chars)
  metaDescription: text          // SEO description (optional, defaults to excerpt, max 160 chars)
  featuredImage: image           // Social sharing image (optional, 1200x630px)
}
```

**Field Notes:**
- `featured: true` → Shows in homepage "Start Here" section (max 4 posts)
- `metaTitle` and `metaDescription` default to `title` and `excerpt` if empty
- `featuredImage` used for Open Graph, Twitter Cards, and article header
- `mainImage` kept for backwards compatibility but prefer `featuredImage`

**Preview Configuration:**
Shows title, featured status, category, and author in Studio list view.

---

### Block Content Schema

**File:** `sanity/schemaTypes/blockContentType.ts`

Defines Portable Text structure with custom blocks for Prague-specific content.

#### Standard Blocks

**Supported:**
- **Paragraphs** — Normal text
- **Headings** — H2, H3 only
- **Lists** — Bullet and numbered
- **Marks** — Strong, emphasis, links (with option for `target="_blank"`)

**Not Supported:**
- H1, H4, H5, H6 (to maintain hierarchy)
- Code blocks (not needed for this blog)

#### Custom Blocks

All custom blocks have **icon previews** with emojis for easy identification in Studio.

##### 1. Place Block (`place`)

**Purpose:** Structured recommendations for restaurants, cafés, attractions.

**Fields:**
```typescript
{
  name: string           // Place name (required)
  category: string       // Type: Restaurant, Café, Bar, etc. (required)
  neighborhood: string   // Area/district (optional)
  priceRange: string     // €, €€, €€€, or Free (optional)
  whyGo: text            // Why to visit (required)
  whatToGet: string      // Specific recommendations (optional)
  practical: array       // Practical details (hours, booking, etc.)
  mapLink: url           // Google Maps link (optional)
}
```

**Component:** `PlaceCard.tsx`
- Styled as a card with border
- Grid layout for metadata
- Responsive design

##### 2. Practical Tip Block (`practicalTip`)

**Purpose:** Callouts for tips, warnings, logistics.

**Fields:**
```typescript
{
  variant: string        // tip | warning | avoid | logistics (required)
  title: string          // Callout heading (optional)
  content: blockContent  // Portable text content (required)
}
```

**Variants:**
- **tip** — Green accent, helpful advice
- **warning** — Yellow accent, cautions
- **avoid** — Red accent, what to skip
- **logistics** — Blue accent, practical info

**Component:** `TipCallout.tsx`
- Color-coded by variant
- Icon/emoji for each type
- Supports rich text content

##### 3. Quick Summary Block (`quickSummary`)

**Purpose:** TL;DR bullet lists.

**Fields:**
```typescript
{
  title: string          // Summary heading (optional, default: "Quick Summary")
  bullets: array         // 2-6 bullet points (required)
}
```

**Validation:** Requires 2-6 items (not too short, not overwhelming).

**Component:** `QuickSummary.tsx`
- Styled with border and background
- Bullet markers
- Responsive padding

##### 4. Pros/Cons Block (`prosCons`)

**Purpose:** Two-column comparison.

**Fields:**
```typescript
{
  pros: array            // Positive points (required)
  cons: array            // Negative points (required)
}
```

**Component:** `ProsCons.tsx`
- Two-column layout (stacks on mobile)
- Green checkmarks for pros
- Red X marks for cons
- Equal height columns

---

## Data Fetching with GROQ

All data queries are centralized in `sanity/lib/queries.ts` for consistency and type safety.

### Query Functions

#### `getFeaturedPosts()`

**Purpose:** Get posts for "Start Here" section on homepage.

**Query:**
```typescript
*[_type == "post" && featured == true] 
| order(publishedAt desc) 
[0...4] 
{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "categories": categories[]->title
}
```

**Returns:** Array of `PostListItem` (max 4)

**Usage:**
```tsx
const featuredPosts = await getFeaturedPosts();
```

---

#### `getLatestPosts(limit: number)`

**Purpose:** Get recent posts for "Latest Articles" or any list.

**Query:**
```typescript
*[_type == "post"] 
| order(publishedAt desc) 
[0...limit] 
{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "categories": categories[]->title
}
```

**Returns:** Array of `PostListItem`

**Usage:**
```tsx
const latestPosts = await getLatestPosts(3);
```

---

#### `getPostsByCategory(categorySlug: string)`

**Purpose:** Get posts filtered by category.

**Query:**
```typescript
*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] 
| order(publishedAt desc) 
{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "categories": categories[]->title
}
```

**Returns:** Array of `PostListItem`

**Usage:**
```tsx
const posts = await getPostsByCategory('eat-drink');
```

**Note:** Uses `references()` function to check if post categories include the specified category.

---

#### `getAllPosts()`

**Purpose:** Get all posts for articles archive.

**Query:**
```typescript
*[_type == "post"] 
| order(publishedAt desc) 
{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "categories": categories[]->title
}
```

**Returns:** Array of `PostListItem`

**Usage:**
```tsx
const posts = await getAllPosts();
```

---

#### `getPostBySlug(slug: string)`

**Purpose:** Get full post data for individual article page.

**Query:**
```typescript
*[_type == "post" && slug.current == $slug][0] 
{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "author": author->name,
  "categories": categories[]->{
    title,
    "slug": slug.current
  },
  body,
  metaTitle,
  metaDescription,
  featuredImage {
    asset->,
    alt
  },
  mainImage {
    asset->,
    alt
  }
}
```

**Returns:** Full post object with all fields

**Usage:**
```tsx
const post = await getPostBySlug('practical-guide-to-eating-in-prague');
```

**Note:** Returns `null` if post not found (handled with `notFound()` in page component).

---

#### `getAllPostSlugs()`

**Purpose:** Get all slugs for static generation (future use).

**Query:**
```typescript
*[_type == "post" && defined(slug.current)].slug.current
```

**Returns:** Array of strings (slugs)

**Usage:**
```tsx
const slugs = await getAllPostSlugs();
// Use for generateStaticParams()
```

---

### Type Safety: PostListItem

Exported type for article list queries:

```typescript
export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
};
```

**Usage:** All list-based queries return this type for consistency.

---

## Sanity TypeGen

**Purpose:** Generate TypeScript types from Sanity schema for compile-time type safety.

### Configuration

**File:** `sanity-codegen.config.ts`

```typescript
import { SanityCodegenConfig } from 'sanity-codegen';

const config: SanityCodegenConfig = {
  schemaPath: './sanity/schemaTypes/index.ts',
  outputPath: './sanity.types.ts',
  // Generates types for all schemas in schemaTypes/
};

export default config;
```

### Generated Types

**File:** `sanity.types.ts` (auto-generated, **do not edit manually**)

**Contents:**
- TypeScript interfaces for all schema types
- Post, Category, Author, BlockContent types
- Sanity document types with metadata

**Example:**
```typescript
export interface Post extends SanityDocument {
  _type: 'post';
  title: string;
  slug: Slug;
  excerpt?: string;
  body?: BlockContent;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: Image;
  categories?: Reference<Category>[];
  featured?: boolean;
  publishedAt?: string;
  // ...
}
```

### Running TypeGen

**Command:**
```bash
npm run typegen
```

**Process:**
1. Extracts schema from `sanity/schemaTypes/index.ts`
2. Generates `schema.json` (intermediate)
3. Creates `sanity.types.ts` with TypeScript interfaces

**When to Run:**
- After modifying any file in `sanity/schemaTypes/`
- After adding/removing fields
- After changing field types or validation

**Output:**
```
✓ Extracted schema to ./schema.json
✓ Generated TypeScript types for 15 schema types into: ./sanity.types.ts
```

### Using Generated Types

**Import:**
```typescript
import type { Post, Category, Author } from '@/sanity.types';
```

**Usage in Queries:**
```typescript
// Type-safe query results
const post: Post | null = await client.fetch(query, { slug });
```

**Benefits:**
- Autocomplete in VS Code
- Compile-time error checking
- Refactoring safety
- Documentation through types

---

## Data Flow Architecture

### Server Components Pattern

All page components are **async server components** — data fetching happens on the server, no client-side loading states needed.

**Example: Category Page**

```tsx
// app/(site)/eat-drink/page.tsx
import { getPostsByCategory } from '@/sanity/lib/queries';
import ArticleList from '@/components/ArticleList';

export default async function EatDrinkPage() {
  // Fetch data on server
  const posts = await getPostsByCategory('eat-drink');

  // Render with data
  return (
    <div>
      <header>
        <h1>Eat & Drink</h1>
        <p>Honest recommendations for cafés, restaurants...</p>
      </header>
      <ArticleList posts={posts} emptyMessage="No articles yet." />
    </div>
  );
}
```

**Benefits:**
1. **SEO:** Content rendered on server, crawlable by search engines
2. **Performance:** No client-side fetching, no loading spinners
3. **Simplicity:** No useEffect, useState, or loading states
4. **Type Safety:** Server-side code fully typed with generated types

---

### Image Handling

**Sanity CDN Configuration:**

**File:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};
```

**Image URL Builder:**

**File:** `sanity/lib/image.ts`

```typescript
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

**Usage in Components:**

```tsx
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

// In component:
<Image
  src={urlFor(post.featuredImage).width(1200).height(630).url()}
  alt={post.featuredImage.alt || post.title}
  width={1200}
  height={630}
/>
```

**Best Practices:**
- Always specify width and height for optimization
- Use `urlFor()` to generate responsive image URLs
- Provide alt text for accessibility
- Common sizes: 1200x630 (social), 800x600 (article)

---

## Component Architecture

### Reusable Components

#### ArticleList

**File:** `components/ArticleList.tsx`

**Purpose:** Consistent article list rendering across all pages.

**Props:**
```typescript
{
  posts: PostListItem[];
  emptyMessage?: string;
}
```

**Features:**
- Maps over posts array
- Renders title (linked), excerpt, formatted date
- Shows empty state message when `posts.length === 0`
- Consistent typography and spacing
- Mobile-responsive

**Usage:**
```tsx
<ArticleList 
  posts={posts} 
  emptyMessage="No articles in this category yet." 
/>
```

**Used On:**
- Homepage "Latest Articles"
- All category pages
- Articles archive

---

### Portable Text Components

All components in `components/portable-text/` render custom Sanity blocks.

#### PortableBody (Main Renderer)

**File:** `components/portable-text/PortableBody.tsx`

**Purpose:** Central Portable Text renderer with custom component mapping.

**Configuration:**
```typescript
const portableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="...">{children}</h2>,
    h3: ({ children }) => <h3 className="...">{children}</h3>,
    normal: ({ children }) => <p className="...">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="...">{children}</ul>,
    number: ({ children }) => <ol className="...">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="...">{children}</strong>,
    em: ({ children }) => <em className="...">{children}</em>,
    link: ({ value, children }) => <a href={value.href} target={value.blank ? '_blank' : '_self'}>{children}</a>,
  },
  types: {
    place: PlaceCard,
    practicalTip: TipCallout,
    quickSummary: QuickSummary,
    prosCons: ProsCons,
  },
};
```

**Usage:**
```tsx
import PortableBody from '@/components/portable-text/PortableBody';

<PortableBody value={post.body} />
```

**Styling:**
- All styles use CSS variables for theming
- Typography matches design system
- Responsive spacing and sizing

---

#### Custom Block Components

Each custom block has its own component file:

1. **PlaceCard.tsx** — Structured place recommendations
2. **TipCallout.tsx** — Color-coded tips/warnings with variants
3. **QuickSummary.tsx** — Bullet list summaries
4. **ProsCons.tsx** — Two-column pros/cons comparison

**Common Patterns:**
- Accept `value` prop with block data
- Use CSS variables for colors
- Responsive grid/flex layouts
- Null checks for optional fields
- Semantic HTML

---

## Client Components

Only two components use `"use client"` directive:

### 1. Theme Toggle

**File:** `app/(site)/theme-toggle.tsx`

**Purpose:** Light/dark mode switcher.

**Features:**
- Reads/writes `localStorage`
- Toggles `.dark` class on `<html>`
- Shows sun/moon icon
- Fixed bottom-right position

**State:**
```typescript
const [theme, setTheme] = useState<'light' | 'dark'>('light');
```

**Persistence:**
```typescript
localStorage.setItem('theme', theme);
document.documentElement.classList.toggle('dark', theme === 'dark');
```

---

### 2. Mobile Nav

**File:** `app/(site)/mobile-nav.tsx`

**Purpose:** Hamburger menu with slide-out drawer.

**Features:**
- Manages open/closed state
- Click outside to close
- Mobile-only (`md:hidden`)
- Links to all pages
- Close button (×)

**State:**
```typescript
const [isOpen, setIsOpen] = useState(false);
```

**Layers:**
- Overlay: `z-90` (dark backdrop)
- Drawer: `z-100` (navigation panel)

---

## Metadata and SEO

### Dynamic Metadata

**File:** `app/(site)/articles/[slug]/page.tsx`

**Implementation:**
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.excerpt;
  const ogImage = post.featuredImage 
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: ogImage ? [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: post.featuredImage?.alt || post.title 
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
```

**Fallback Strategy:**
- `metaTitle` → `title` (if empty)
- `metaDescription` → `excerpt` (if empty)
- `featuredImage` → No image (if empty)

**Social Sharing:**
- Open Graph for Facebook, LinkedIn
- Twitter Cards for Twitter/X
- Image optimization via Sanity CDN

---

## Development Workflow

### Local Development

**Start Dev Server:**
```bash
npm run dev
```

**Sanity Studio:**
Navigate to `http://localhost:3000/studio`

**TypeGen (After Schema Changes):**
```bash
npm run typegen
```

### Environment Variables

**File:** `.env.local` (not in git)

**Required:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token_here
```

**Finding Values:**
- Project ID: Sanity dashboard
- Dataset: Usually "production"
- API Version: Use current date (YYYY-MM-DD)
- API Token: Generate in Sanity dashboard (Editor or Admin)

---

## Best Practices

### Data Fetching

✅ **Do:**
- Use async server components
- Centralize queries in `sanity/lib/queries.ts`
- Return typed data with `PostListItem` or generated types
- Handle null/empty cases with empty states

❌ **Don't:**
- Use `useEffect` for data fetching
- Duplicate GROQ queries across files
- Fetch data in client components
- Ignore TypeScript errors

---

### Schema Changes

**Workflow:**
1. Edit schema file in `sanity/schemaTypes/`
2. Run `npm run typegen` to update types
3. Update queries if fields changed
4. Update components using the data
5. Test in Sanity Studio
6. Commit schema file and generated types together

---

### Component Structure

✅ **Do:**
- Keep server components async
- Extract reusable components (like ArticleList)
- Use TypeScript for props
- Handle loading and error states

❌ **Don't:**
- Add "use client" unless necessary
- Duplicate component logic
- Ignore prop types
- Mix data fetching with presentation

---

### Performance

**Optimizations:**
- Server-side rendering (SSR) for all pages
- Next.js Image optimization
- Sanity CDN for images
- Type-safe queries (no runtime errors)
- Minimal client JavaScript

**Future:**
- Incremental Static Regeneration (ISR)
- Static generation for articles
- Route caching strategies

---

## Troubleshooting

### Common Issues

**Problem:** "Hostname 'cdn.sanity.io' is not configured"
**Solution:** Add Sanity CDN to `next.config.ts` images.remotePatterns

**Problem:** TypeScript errors after schema changes
**Solution:** Run `npm run typegen` and restart TypeScript server

**Problem:** Studio not loading at `/studio`
**Solution:** Check route group structure, ensure studio layout returns children only

**Problem:** Articles not showing on homepage
**Solution:** Mark posts as `featured: true` in Sanity Studio

**Problem:** Category page showing no articles
**Solution:** Verify category slug matches Sanity category slug exactly

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy from `main` branch
4. Set up production Sanity dataset

### Sanity Setup

1. Create production dataset in Sanity dashboard
2. Update `.env.local` with production values
3. Add production CORS origins in Sanity settings
4. Deploy Sanity Studio (if separate hosting needed)

---

## Scripts Reference

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typegen      # Generate Sanity TypeScript types
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Portable Text Documentation](https://portabletext.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated:** December 26, 2025
