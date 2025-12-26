# Prague Blog — Design Documentation

## Overview

A calm, readable travel blog built with Next.js, Sanity CMS, and Tailwind CSS. The design prioritizes editorial clarity, quiet confidence, and a magazine-like reading experience.

**Core Philosophy:**
- Calm and uncluttered
- Editorial and trustworthy
- Mobile-first responsive design
- No heavy filtering or interactive complexity

---

## Site Map

```
/                           Homepage (hero, Start Here, Latest Articles)
├── /eat-drink              Category: Cafés, restaurants, food guides
├── /neighborhoods          Category: Where to stay, area breakdowns
├── /things-to-do           Category: Attractions, day trips, activities
├── /practical-tips         Category: Transport, logistics, systems
├── /articles               All articles (chronological, no filters)
├── /articles/[slug]        Individual article page
├── /about                  About page (editorial, minimal)
└── /studio                 Sanity Studio CMS (admin, isolated layout)
```

---

## Design System

### Color Palette

**Light Mode (Default)**
```css
--background: #fdfcfb       /* Warm off-white */
--foreground: #2b2b2b       /* Near-black text */
--accent: #a64d4d           /* Muted Prague brick red */
--accent-dark: #8b3a3a      /* Darker red for hover states */
--muted: #6b6b6b            /* Secondary text */
--border: #e8e3df           /* Subtle dividers */
--card-bg: #ffffff          /* Solid white for cards/overlays */
```

**Dark Mode**
```css
--background: #1a1816       /* Dark brown-black */
--foreground: #e8e3df       /* Warm light gray */
--accent: #c97d7d           /* Lighter red for dark mode */
--accent-dark: #b86868      /* Hover state */
--muted: #9b9490            /* Secondary text */
--border: #2d2926           /* Dark dividers */
--card-bg: #222018          /* Slightly lighter dark */
```

### Typography

**Headline Font:** Georgia (serif)
- Used for: H1, H2, H3, article titles, section headings
- Weight: 600 (semibold)
- Letter spacing: -0.02em to -0.025em

**Body Font:** System sans-serif stack
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif
```
- Base size: 1.0625rem (17px)
- Line height: 1.75
- Letter spacing: -0.011em

### Responsive Typography Scale

| Element | Mobile | Small (640px+) | Medium (768px+) |
|---------|--------|----------------|-----------------|
| **Homepage H1** | 2rem (32px) | 2.75rem (44px) | 3.125rem (50px) |
| **Category H1** | 2rem | 2.5rem (40px) | 3rem (48px) |
| **Article Titles** | 1.25rem (20px) | 1.5rem (24px) | 1.5rem |
| **Start Here Links** | 1.0625rem (17px) | 1.3125rem (21px) | 1.3125rem |
| **All-Caps Kicker** | 0.71rem (11.4px) | 0.875rem (14px) | 0.875rem |

### Spacing System

**Section Gaps (Vertical Rhythm)**
- Mobile: `gap-10` (2.5rem / 40px)
- Small: `gap-16` (4rem / 64px)
- Medium: `gap-20` (5rem / 80px)

**Article List Gaps**
- Mobile: `gap-8` (2rem / 32px)
- Small: `gap-10` (2.5rem / 40px)

**Layout Padding**
- Mobile: `px-5` (1.25rem / 20px)
- Small: `px-6` (1.5rem / 24px)

**Max Width**
- Content container: `max-w-[52rem]` (832px)
- Mobile nav drawer: `w-[min(80vw,16rem)]`

---

## Page Layouts

### Homepage (`/`)

**Structure:**
1. **Hero Section**
   - H1: "Practical Prague"
   - Intro text: One-sentence value prop
   - All-caps kicker: Three-part tagline
   - Mobile optimizations: reduced spacing, tighter kicker

2. **Divider**
   - Accent color border
   - 80% width on mobile, full on desktop
   - Centered with auto margins

3. **Start Here Section**
   - H2: "Start Here"
   - Intro paragraph
   - 4 curated article links
   - Active states for touch feedback (`active:opacity-80`)

4. **Latest Articles Section**
   - H2: "Latest Articles" + decorative divider
   - Vertical list of 5 articles
   - Each article: title, excerpt, date
   - Consistent `.link-hover` behavior

### Category Pages (`/eat-drink`, `/neighborhoods`, etc.)

**Structure:**
1. **Header**
   - Category title (H1)
   - One-sentence description

2. **Article List**
   - Simple chronological list
   - No filters, no toggles
   - Reuses article card component
   - Same typography as Latest Articles

**Category Descriptions:**
- **Eat & Drink:** "Honest recommendations for cafés, restaurants, and places worth eating in Prague."
- **Neighborhoods:** "Where to stay, what each area feels like, and what to expect from Prague's different districts."
- **Things to Do:** "What to see, skip, and experience in Prague — from an expat perspective."
- **Practical Tips:** "The logistics, systems, and unspoken rules that help you navigate Prague like a local."

### All Articles Page (`/articles`)

**Structure:**
- Title: "All Articles"
- Description: "Every guide, recommendation, and practical tip — in chronological order."
- Full chronological list (no categories shown)
- Uses reusable `ArticleList` component
- Intentionally "boring" — just a simple archive

### About Page (`/about`)

**Structure:**
- Editorial, text-first layout
- Max-width: 38rem (constrained for readability)
- Three sections:
  1. **What Practical Prague Is** — site purpose and focus
  2. **Who It's Written By** — minimal, no personal branding
  3. **How to Use the Site** — light onboarding
- No images, no illustrations, no cards
- Same typography as article pages
- ~270 words total (fits on one screen)

### Individual Article Page (`/articles/[slug]`)

**Structure:**
1. **Featured Image** (optional)
   - Full-width, responsive
   - Negative margin to extend to edges
   
2. **Article Header**
   - H1: Article title
   - Excerpt: Larger subheading text
   - Metadata: Date • Author • Categories

3. **Article Body**
   - Portable Text renderer with custom blocks:
     - **Place Card** — recommendations with details
     - **Tip Callout** — 4 variants (tip, warning, avoid, logistics)
     - **Quick Summary** — bullet lists
     - **Pros/Cons** — two-column comparison
   - Standard rich text (H2, H3, paragraphs, lists, links)

4. **Back Link**
   - Border-top separator
   - "← Back to all articles" link

---

## Components

### Header / Navigation

**Desktop Navigation (`md:flex`)**
- Sticky header: `sticky top-0 z-20`
- Logo: "PRACTICAL PRAGUE" (all-caps, muted, tracking-wide)
- **Primary Nav:** Eat & Drink (bold) | Neighborhoods | Things to Do | Practical Tips
- **Secondary Nav:** About (muted, smaller, border-left separator)
- Theme toggle: Fixed bottom-right corner

**Mobile Navigation (`md:hidden`)**
- Hamburger menu: 3-line icon
- Slide-out drawer from right
- Overlay: `z-90`, black/50
- Drawer: `z-100`, solid background
- Nav items: 4 primary categories + All Articles + About (secondary)
- Nav item spacing: `gap-7` for better tap targets
- Close button: × (large, top-right)

### Theme Toggle

**Behavior:**
- Defaults to light mode
- Persists preference in `localStorage`
- Uses `.dark` class on `<html>` element
- Fixed position: `bottom-6 right-6`
- Icons: Sun (light mode) / Moon (dark mode)

### Article Card / ArticleList Component

**Reusable Component:**
`components/ArticleList.tsx` — used across category pages and archives

**Structure:**
```tsx
<article>
  <h2>Title (link with .link-hover)</h2>
  <p>Excerpt</p>
  <time>Date</time>
</article>
```

**Styling:**
- Title: Georgia serif, 1.25rem → 1.5rem
- Excerpt: System sans, 0.9375rem → 1rem, muted color
- Date: 0.8125rem → 0.875rem, muted + opacity 0.7
- Empty state: Helpful message when no posts exist

**Usage:**
- Homepage "Latest Articles"
- Category pages (eat-drink, neighborhoods, etc.)
- All articles archive
- Server-side data fetching with type-safe queries

### Link Hover States

**Custom `.link-hover` Class**
```css
.link-hover:hover {
  text-decoration: underline;
  color: var(--accent);
}
```

Used for:
- All article title links
- Start Here section links
- Inline content links

---

## Responsive Behavior

### Breakpoints

```css
/* Mobile-first approach */
Default:        0px - 639px   (mobile)
sm:             640px+        (small tablets)
md:             768px+        (desktop)
```

### Key Responsive Changes

**Mobile Optimizations:**
1. **Header height:** Reduced padding (`py-3` vs `py-5`)
2. **Hero spacing:** Tighter margins on kicker line
3. **Dividers:** 80% width, centered
4. **Start Here links:** Larger tap targets (`py-1.5`)
5. **Section gaps:** Reduced from `gap-12` to `gap-10`
6. **Typography:** Scaled down across all elements
7. **Navigation:** Hamburger menu replaces horizontal nav

**Desktop Enhancements:**
- Full-width dividers
- Larger typography
- Horizontal navigation
- More generous spacing

---

## Theme System

### Implementation

**HTML Class Toggle:**
```tsx
document.documentElement.classList.toggle("dark", isDark);
```

**CSS Variables:**
- Defined in `:root` (light mode)
- Overridden in `.dark` selector (dark mode)
- Used throughout: `style={{ color: 'var(--foreground)' }}`

**Persistence:**
```tsx
localStorage.setItem("theme", theme);
```

### Why CSS Variables?

Tailwind v4 requires explicit variable integration. Can't rely solely on utility classes for theme-dependent colors. All color references use `var(--variable-name)` in inline styles.

---

## Technical Stack

**Framework:** Next.js 16.1.1 (App Router, React Server Components)
**CMS:** Sanity Studio 4.22.0
**Styling:** Tailwind CSS v4 (via @tailwindcss/postcss)
**Language:** TypeScript 5
**React:** 19.2.3
**Content:** @portabletext/react 6.0.0
**Images:** Next.js Image with Sanity CDN integration

### Data Architecture

**Sanity TypeGen:**
- Generates TypeScript types from schema
- Run: `npm run typegen`
- Output: `sanity.types.ts`

**Query Functions:**
- Centralized in `sanity/lib/queries.ts`
- Type-safe GROQ queries
- Server-side data fetching
- Functions:
  - `getFeaturedPosts()` — Homepage "Start Here"
  - `getLatestPosts(limit)` — Latest articles
  - `getPostsByCategory(slug)` — Category filtering
  - `getAllPosts()` — Articles archive
  - `getPostBySlug(slug)` — Individual articles
  - `getAllPostSlugs()` — Static generation

### File Structure

```
app/
├── globals.css                      # CSS variables, theme, global styles
├── layout.tsx                       # Root layout (html/body only)
├── (site)/                          # Route group for blog
│   ├── layout.tsx                   # Site layout with header/nav
│   ├── page.tsx                     # Homepage (server component)
│   ├── theme-toggle.tsx             # Light/dark mode toggle
│   ├── mobile-nav.tsx               # Mobile hamburger menu
│   ├── about/page.tsx               # About page
│   ├── eat-drink/page.tsx           # Category page
│   ├── neighborhoods/page.tsx       # Category page
│   ├── things-to-do/page.tsx        # Category page
│   ├── practical-tips/page.tsx      # Category page
│   ├── articles/
│   │   ├── page.tsx                 # All articles archive
│   │   └── [slug]/page.tsx          # Individual article
│   └── studio/                      # Isolated studio route
│       ├── layout.tsx               # Minimal layout (children only)
│       └── [[...tool]]/page.tsx     # Sanity Studio

components/
├── ArticleList.tsx                  # Reusable article list
└── portable-text/
    ├── PortableBody.tsx             # Main renderer
    ├── PlaceCard.tsx                # Place recommendations
    ├── TipCallout.tsx               # Tips/warnings/logistics
    ├── QuickSummary.tsx             # Bullet summaries
    └── ProsCons.tsx                 # Pros/cons comparison

sanity/
├── schemaTypes/
│   ├── authorType.ts                # Author schema
│   ├── categoryType.ts              # Category schema
│   ├── postType.ts                  # Post schema (updated metadata)
│   ├── blockContentType.ts          # Portable Text with custom blocks
│   └── index.ts                     # Schema registry
├── lib/
│   ├── client.ts                    # Sanity client config
│   ├── image.ts                     # Image URL builder (urlFor)
│   ├── live.ts                      # Live preview config
│   └── queries.ts                   # Type-safe GROQ queries
├── structure.ts                     # Studio structure
├── env.ts                           # Environment config
└── sanity.config.ts                 # Studio configuration

sanity.types.ts                      # Generated TypeScript types
sanity-codegen.config.ts             # TypeGen configuration
next.config.ts                       # Next.js config (Sanity CDN images)
```

---

## Design Principles

### ✅ Do

- Keep layouts simple and predictable
- Use consistent typography scale
- Prioritize readability over decoration
- Maintain calm, generous spacing
- Use hover states for desktop, active states for mobile
- Default to light mode
- Keep navigation meaningful and functional

### ❌ Don't

- Add category pills or filter UI
- Use masonry or complex layouts
- Add infinite scroll
- Use icons in navigation
- Add heavy animations
- Break the typography hierarchy
- Clutter the header with too many links

---

## Future Considerations

### When Content Grows

**If 50+ articles:**
- Add pagination to category pages (bottom only, no "Load More")
- Keep it simple: "← Older | Newer →"

**If categories get crowded:**
- Consider dropdown menus on desktop
- Keep mobile nav as-is (vertical list works at scale)

### Potential Enhancements

- Search functionality (simple, full-page)
- Related articles (below post content)
- RSS feed
- Newsletter signup (footer only)
- Performance optimization (ISR, image optimization)

### What NOT to Add

- Social media feed integration
- Comment system
- Complex analytics dashboards
- Tag clouds
- Sidebar widgets
- Pop-ups or banners
- Personal author photos or branding

---

## Current Status

**Completed:**
✅ Color scheme redesign (muted Prague red)
✅ Typography system (Georgia serif + system sans)
✅ Theme toggle (light mode default)
✅ Mobile-first responsive design
✅ Navigation structure (desktop + mobile, primary/secondary groups)
✅ Homepage layout with real Sanity data
✅ Category pages (4 categories) with data integration
✅ All Articles archive page with data integration
✅ About page (editorial, minimal)
✅ Individual article template with Portable Text
✅ Custom Portable Text blocks (Place, Tip, Summary, Pros/Cons)
✅ Mobile nav functionality with About link
✅ Link hover states and active states for touch
✅ Consistent spacing system
✅ Sanity schema with metadata fields (metaTitle, metaDescription, featuredImage)
✅ TypeGen setup for type-safe queries
✅ Server-side data fetching with GROQ
✅ Reusable ArticleList component
✅ Route groups for studio isolation
✅ SEO metadata with Open Graph and Twitter Cards
✅ Next.js Image integration with Sanity CDN

**Next Steps:**
- Create sample content in Sanity Studio
- Test with real articles and featured posts
- Cross-browser compatibility testing
- Performance optimization (image optimization, caching)
- Deploy to production (Vercel recommended)
- Set up Sanity dataset (production environment)

---

## Maintenance Notes

### Updating Colors

Edit CSS variables in [app/globals.css](../app/globals.css):
- `:root` for light mode
- `.dark` for dark mode

### Adding New Categories

1. Create new page: `app/category-slug/page.tsx`
2. Update navigation in [app/layout.tsx](../app/layout.tsx) (desktop nav)
3. Update [app/mobile-nav.tsx](../app/mobile-nav.tsx)
4. Add category description following established pattern

### Typography Adjustments

All typography uses inline styles with CSS variables. To adjust:
- Font sizes: Update `text-[size]` classes and breakpoint variants
- Spacing: Update Georgia serif letter-spacing in style prop
- Line height: Update `leading-[value]` classes

### Z-Index Layers

```
Header:         z-20
Overlay:        z-90
Mobile drawer:  z-100
```

Keep mobile nav layers above header to prevent interaction issues.

### Sanity Schema Updates

**Post Schema Fields:**
- `title` (required)
- `slug` (required, auto-generated)
- `excerpt` (required, max 200 chars)
- `author` (reference)
- `mainImage` (legacy, optional)
- `categories` (required, 1-2 refs)
- `featured` (boolean, for "Start Here")
- `publishedAt` (required)
- `body` (blockContent with custom blocks)
- `metaTitle` (optional, defaults to title)
- `metaDescription` (optional, defaults to excerpt)
- `featuredImage` (optional, for social sharing & article header)

**Custom Block Types:**
- `place` — Name, category, price, details, map link
- `practicalTip` — Variants: tip, warning, avoid, logistics
- `quickSummary` — Title + bullet list (2-6 items)
- `prosCons` — Pros array + cons array

### Data Fetching Pattern

All pages use async server components:
```tsx
export default async function Page() {
  const data = await getDataFunction();
  return <Component data={data} />;
}
```

Benefits:
- Server-side rendering
- Type safety with generated types
- No loading states needed
- Better SEO
- Simplified data flow

---

**Last Updated:** December 26, 2025
