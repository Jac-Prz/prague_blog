# Draft & Publishing Workflow

## Overview

This blog uses a **draft-first workflow** where all new posts start as drafts and must be explicitly published to appear on the public site.

## Post Status

Every post has a `status` field with two possible values:

- **Draft** (default for new posts)
  - Not visible on public pages
  - Only visible in admin dashboard
  - Can be edited and previewed in Sanity Studio
  
- **Published**
  - Visible on homepage, category pages, and article pages
  - Included in sitemap
  - Indexed by search engines (unless `noIndex` is set)

## Workflow

### 1. Creating a New Post

1. Go to http://localhost:3000/studio
2. Click "Post" → "Create"
3. Post automatically starts with **Status: Draft**
4. Fill in all required fields:
   - Title
   - Slug
   - Excerpt
   - Body content
   - Featured Image (recommended)
   - Categories
   - SEO fields (metaTitle, metaDescription)

### 2. Previewing Drafts

**In Sanity Studio:**
- Use Studio's built-in preview panel (right side)
- Click "Open preview" to see draft rendering

**In Admin Dashboard:**
1. Go to http://localhost:3000/admin
2. Enter admin password (from `ADMIN_PASSWORD` env var)
3. View all drafts in the dashboard
4. Click "Edit & Preview in Studio" to open in Studio

**Important:** Draft posts do NOT have public URLs. They return 404 if accessed via `/articles/[slug]` when status is "draft".

### 3. Publishing a Post

**To make a post public:**

1. Open post in Sanity Studio
2. Change **Status** from "Draft" to "Published"
3. Click **Publish** (green button)
4. Post is now visible on the public site

**Where published posts appear:**
- Homepage (if featured or in latest posts)
- Category pages (filtered by category)
- `/articles` archive page
- Individual article page at `/articles/[slug]`
- Sitemap at `/sitemap.xml`

### 4. Unpublishing a Post

**To remove a post from public view:**

1. Open post in Sanity Studio
2. Change **Status** from "Published" to "Draft"
3. Click **Publish**
4. Post is removed from public pages
5. Still accessible in admin dashboard at `/admin/drafts`

### 5. Editing Published Posts

**Option A: Edit and save immediately**
1. Open post in Studio
2. Make changes
3. Click **Publish**
4. Changes appear on site immediately (after cache clear)

**Option B: Draft changes before publishing**
1. Change status to "Draft"
2. Make changes
3. Preview in Studio
4. When ready, change status to "Published"
5. Click **Publish**

## Admin Dashboard

### Accessing Admin

URL: http://localhost:3000/admin

**Authentication:**
- Password-based (single admin)
- Password stored in `ADMIN_PASSWORD` environment variable
- Session persists in browser until logout

**Security:**
- HttpOnly cookies for session management
- Middleware protects `/admin/drafts` route
- No API tokens exposed to client

### Draft Dashboard Features

At http://localhost:3000/admin/drafts:

- **Draft count**: Shows number of unpublished posts
- **Draft list**: All posts with status="draft"
- **Draft badge**: Visual indicator on each post
- **Metadata**: Title, excerpt, date, categories
- **Edit button**: Opens post in Sanity Studio
- **Logout**: Clears session and redirects to login

### Admin Workflow

```
┌─────────────────┐
│  Create Post    │ ────────► Status: Draft (default)
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Edit in Studio │ ◄─────── Preview in Studio panel
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ View in /admin  │ ────────► Review all drafts
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Set Published   │ ────────► Live on site
└─────────────────┘
```

## Data Queries

### Public Queries (Frontend)

All public-facing queries filter for `status == "published"`:

**Homepage:**
```groq
*[_type == "post" && featured == true && status == "published"]
*[_type == "post" && status == "published"] | order(publishedAt desc)
```

**Category pages:**
```groq
*[_type == "post" && status == "published" && references($categoryId)]
```

**Individual article:**
```groq
*[_type == "post" && slug.current == $slug && status == "published"][0]
```

**Sitemap:**
```groq
*[_type == "post" && status == "published"].slug.current
```

### Admin Queries (Backend)

Admin-only queries for draft management:

**Draft listing:**
```groq
*[_type == "post" && status == "draft"] | order(_updatedAt desc)
```

**All posts (admin):**
```groq
*[_type == "post"] | order(_updatedAt desc)
```

These queries are protected by authentication and only accessible via `/api/admin/*` routes.

## Security Considerations

### Authentication

**Current implementation:**
- Single admin password
- Cookie-based sessions (24hr expiry)
- HttpOnly cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite=Strict (CSRF protection)

**What's protected:**
- `/admin/drafts` route (middleware)
- `/api/admin/drafts` endpoint (cookie check)
- Admin logout clears cookies

**What's NOT protected:**
- Draft content is not encrypted
- Anyone with Studio access can see drafts
- Cookie can be stolen if HTTPS is not used

### Production Recommendations

1. **Use strong password**: Change `ADMIN_PASSWORD` to a secure value
2. **Enable HTTPS**: Ensure secure cookie transmission
3. **Limit Studio access**: Use Sanity's role-based access control
4. **Monitor access**: Check Sanity audit logs regularly
5. **Consider OAuth**: For multi-user setups, implement proper OAuth

## Troubleshooting

### Issue: Posts not showing on homepage

**Causes:**
1. Post status is "draft" (not "published")
2. Post has `noIndex` set (this doesn't affect homepage, only search engines)
3. Post is not featured (for "Start Here" section)
4. Post has no published date

**Solutions:**
1. Check post status in Sanity Studio
2. Verify `publishedAt` field is set
3. For "Start Here" section, enable `featured` checkbox
4. Check query logs in terminal for errors

### Issue: Draft post returns 404

**Expected behavior:** Draft posts are not publicly accessible and should return 404.

**If you need to preview:**
- Use Sanity Studio's preview panel
- Or publish the post temporarily to see it live

### Issue: Published post not visible

**Causes:**
1. CDN cache not cleared
2. Status field not saved properly
3. Query error in backend

**Solutions:**
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Check Sanity Studio to verify status="published"
3. Check terminal logs for query errors
4. Disable CDN temporarily: set `useCdn: false` in `sanity/lib/client.ts`

### Issue: Can't access admin dashboard

**Causes:**
1. Wrong password
2. `ADMIN_PASSWORD` not set in `.env.local`
3. Session expired
4. Cookies disabled in browser

**Solutions:**
1. Check `.env.local` for correct password
2. Clear browser cookies for localhost
3. Try incognito/private window
4. Check browser console for errors

### Issue: All posts missing status field

**Cause:** Posts created before status field was added to schema.

**Solution:**
1. Open each post in Sanity Studio
2. Set status to "Published" or "Draft"
3. Click Publish to save

Or use a migration script to bulk update (see below).

## Data Migration

### Bulk Update Posts Without Status

If you have many posts without the `status` field, use this Node.js script:

```javascript
const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2025-12-26',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN // Write token required
});

async function migratePostStatus() {
  // Find all posts without status
  const posts = await client.fetch('*[_type == "post" && !defined(status)] { _id }');
  
  console.log(`Found ${posts.length} posts without status`);
  
  // Set all to published
  const mutations = posts.map(post => ({
    patch: {
      id: post._id,
      set: { status: 'published' }
    }
  }));
  
  if (mutations.length > 0) {
    await client.mutate(mutations);
    console.log('Migration complete');
  }
}

migratePostStatus();
```

**Important:** This requires a Sanity API token with write permissions.

## Future Enhancements

### Planned Features

- [ ] Scheduled publishing (publish at specific date/time)
- [ ] Multi-user admin with roles
- [ ] Revision history in admin
- [ ] Bulk actions (publish/unpublish multiple posts)
- [ ] Preview mode with secret tokens (Next.js Draft Mode)

### Advanced Preview Mode

For complex preview needs, implement Next.js Draft Mode:

1. Create `/api/preview` route with secret token
2. Enable draft mode: `draftMode().enable()`
3. Modify queries to include drafts when draft mode active
4. Add "Exit preview" banner

This allows previewing drafts at their public URLs without making them public.

## Best Practices

### Content Workflow

1. **Write in drafts**: Always start with status="draft"
2. **Review before publishing**: Use Studio preview extensively
3. **SEO check**: Verify metaTitle ≠ title, description 150-160 chars
4. **Image check**: Ensure featured image and OG image are set
5. **Category assignment**: Every post should have at least one category
6. **Final review**: Read entire post in preview before publishing

### Admin Management

1. **Change default password**: Update `ADMIN_PASSWORD` immediately
2. **Use strong passwords**: Minimum 20 characters, random
3. **Logout after use**: Especially on shared computers
4. **Regular audits**: Review draft list weekly
5. **Clean up old drafts**: Delete or publish abandoned drafts

### Performance

1. **Limit draft queries**: Admin dashboard should paginate if >50 drafts
2. **Use CDN for public queries**: Keep `useCdn: true` in production
3. **Cache published content**: Consider ISR or edge caching
4. **Optimize images**: Use Sanity's image CDN features

## Reference Links

- [Sanity Studio](http://localhost:3000/studio)
- [Admin Dashboard](http://localhost:3000/admin)
- [Homepage](http://localhost:3000)
- [Articles Archive](http://localhost:3000/articles)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Draft Mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)
