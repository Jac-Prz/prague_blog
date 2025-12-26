# Portable Text Implementation Guide

## Overview

The blog uses Sanity's Portable Text for rich content editing with custom "Practical Prague" blocks. Content editors can create articles using standard text formatting plus specialized components.

---

## Available Content Blocks

### Standard Text Formatting

**Paragraph** (default)
- Normal body text
- Rendered with proper line height and spacing

**Headings**
- **H2**: Main section headings
- **H3**: Subsection headings
- ⚠️ H1 is NOT available (reserved for article title)

**Lists**
- Bullet lists
- Numbered lists

**Inline Formatting**
- **Bold** (strong)
- *Italic* (emphasis)
- Links with optional "open in new tab"

**Images**
- Full-width images with captions
- Alt text required for accessibility

---

## Custom Practical Prague Blocks

### 1. Place (☕ Recommendation Card)

**Use for:** Cafés, restaurants, bars, shops, markets

**Fields:**
- **Name** (required): Business name
- **Category** (required): cafe, restaurant, bar, bakery, market, shop, other
- **Neighborhood**: E.g., "Vinohrady", "Žižkov"
- **Price**: €, €€, or €€€
- **Why Go** (required): 1-2 sentences, max 200 chars
- **What to Get**: Recommended items
- **Practical Info**: Array of tips (e.g., "Cash only", "Book ahead")
- **Map Link**: Google Maps URL

**Preview:** Shows emoji + name + neighborhood

**Example:**
```
☕ Café Savoy
Malá Strana
```

---

### 2. Practical Tip (💡 Callout)

**Use for:** Important information, warnings, logistics

**Types:**
- **Tip** 💡: Helpful advice
- **Warning** ⚠️: Things to watch out for
- **Avoid** 🚫: What not to do
- **Logistics** 📋: Practical information

**Fields:**
- **Type** (required): Select variant
- **Title** (optional): Short heading
- **Content** (required): Formatted text (bold/italic allowed)

**Preview:** Shows emoji + type + title

**Visual Design:** Colored border-left, subtle background tint

---

### 3. Quick Summary (📝 Bullet Points)

**Use for:** TL;DR sections, key takeaways

**Fields:**
- **Title**: Default "In short" (customizable)
- **Bullets** (required): 2-6 bullet points

**Preview:** Shows title + bullet count

**Visual Design:** Card with accent-colored bullets

---

### 4. Pros & Cons (⚖️ Two-Column List)

**Use for:** Neighborhood comparisons, honest trade-offs

**Fields:**
- **Pros** (required): At least 1 pro
- **Cons** (required): At least 1 con

**Preview:** Shows count of pros and cons

**Visual Design:** Two columns on desktop, stacked on mobile

---

## Component File Structure

```
components/portable-text/
├── PortableBody.tsx          Main renderer with all configurations
├── PlaceCard.tsx             Place recommendation component
├── TipCallout.tsx            Practical tip callout component
├── QuickSummary.tsx          Bullet point summary component
└── ProsCons.tsx              Two-column pros/cons component
```

---

## Usage in Next.js Pages

### Example: Article Page

```tsx
import PortableBody from '@/components/portable-text/PortableBody';

// In your component:
<PortableBody value={post.body} />
```

### Required GROQ Query Fields

```groq
*[_type == "post" && slug.current == $slug][0]{
  title,
  excerpt,
  body,      // ← Portable Text content
  publishedAt,
  "author": author->name,
  "categories": categories[]->title
}
```

---

## Link Behavior

**Internal links:** Open in same tab (default)
**External links:** Option to open in new tab
- When "Open in new tab" is checked:
  - `target="_blank"`
  - `rel="noopener noreferrer"` (security)

**Validation:**
- Must be http, https, or mailto
- Invalid URLs are rendered as plain text

---

## Styling & Typography

### Text Hierarchy

| Element | Mobile | Desktop |
|---------|--------|---------|
| H2 | 1.5rem | 2rem |
| H3 | 1.25rem | 1.5rem |
| Paragraph | 1rem | 1.0625rem |
| Lists | 1rem | 1.0625rem |

### Spacing

- **Between paragraphs:** 1.25rem (20px)
- **Before H2:** 3rem (48px)
- **Before H3:** 2.5rem (40px)
- **Custom blocks:** 2rem-2.5rem vertical margins

### Colors

All text uses CSS variables for theme support:
- `var(--foreground)` - Body text
- `var(--muted)` - Secondary text
- `var(--accent)` - Links, highlights
- `var(--border)` - Dividers, borders
- `var(--card-bg)` - Block backgrounds

---

## Content Guidelines for Editors

### ✅ Do

- Use H2 for main sections, H3 for subsections
- Keep paragraphs scannable (3-5 sentences max)
- Use **Place** blocks for specific recommendations
- Use **Practical Tip** blocks to highlight important info
- Add **Quick Summary** at the top of long articles
- Use **Pros & Cons** for honest neighborhood comparisons

### ❌ Don't

- Use H1 in body (title is separate)
- Nest headings incorrectly (H2 → H4 without H3)
- Overuse bold/italic formatting
- Create long unbroken paragraphs
- Add excessive custom blocks (aim for 2-3 per article max)

---

## Design Principles

**Editorial First**
- Typography-driven
- Generous whitespace
- Minimal decoration

**Mobile Responsive**
- All blocks stack cleanly on mobile
- Readable text sizes
- Touch-friendly spacing

**Performance**
- Images lazy-loaded
- Components render efficiently
- No heavy dependencies

---

## Extending with New Blocks

To add a new custom block:

1. **Add to Sanity schema** (`blockContentType.ts`):
```typescript
defineArrayMember({
  type: 'object',
  name: 'yourBlockName',
  title: 'Your Block',
  fields: [/* your fields */],
  preview: {/* preview config */}
})
```

2. **Create React component** (`components/portable-text/YourBlock.tsx`):
```tsx
export default function YourBlock({ value }) {
  return <div>{/* your markup */}</div>;
}
```

3. **Register in PortableBody** (`PortableBody.tsx`):
```typescript
types: {
  yourBlockName: YourBlock,
}
```

---

## Testing Checklist

Before publishing an article:

- [ ] All headings follow hierarchy (H2 → H3)
- [ ] Links open correctly (internal vs external)
- [ ] Images have alt text
- [ ] Custom blocks render properly on mobile
- [ ] No orphaned text or broken formatting
- [ ] Article reads well in both light and dark mode

---

## Troubleshooting

**Links not working?**
- Check URL format (must include http:// or https://)
- Verify "blank" field is set correctly for external links

**Custom block not rendering?**
- Check block is registered in `portableTextComponents`
- Verify all required fields are filled in Sanity
- Check console for errors

**Spacing looks off?**
- Check for empty paragraphs in Sanity
- Verify block margins in component CSS
- Test in both mobile and desktop views

---

**Last Updated:** December 26, 2025
