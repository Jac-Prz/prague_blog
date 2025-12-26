# Analytics & GDPR Compliance Guide

## Overview

This project implements a privacy-first analytics setup using **Cookiebot** for EU cookie consent and **Google Tag Manager (GTM)** with **Google Analytics 4 (GA4)**, ensuring full GDPR compliance.

## Architecture

### Consent-First Approach

The system follows a strict hierarchy:

1. **Cookiebot loads first** - Blocks all tracking scripts until consent
2. **Consent Mode v2 defaults to "denied"** - No tracking until user consents
3. **GTM loads after Cookiebot** - But tags are blocked by consent requirements
4. **GA4 fires only after consent** - Triggered by GTM when analytics consent granted

### Key Principle

**No non-essential cookies are set before consent is given.**

## Technical Implementation

### 1. Cookiebot Integration

Located in `app/layout.tsx`:

```typescript
{cookiebotId && (
  <Script
    id="Cookiebot"
    src="https://consent.cookiebot.com/uc.js"
    data-cbid={cookiebotId}
    data-blockingmode="auto"
    strategy="beforeInteractive"
  />
)}
```

#### Configuration Details

- **strategy="beforeInteractive"**: Loads before page becomes interactive
- **data-blockingmode="auto"**: Automatically blocks scripts based on consent categories
- **Order matters**: Must load before GTM

#### Cookiebot Categories

Cookiebot uses these consent categories:

- **Necessary**: Always allowed (no consent needed)
- **Preferences**: User experience preferences
- **Statistics**: Analytics cookies (maps to `analytics_storage`)
- **Marketing**: Advertising cookies (maps to `ad_storage`)

### 2. Google Consent Mode v2

Initialized before GTM loads:

```typescript
{gtmId && (
  <Script
    id="google-consent-mode"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          analytics_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      `,
    }}
  />
)}
```

#### Consent States

All Google consent types default to **"denied"**:

- `ad_storage`: Advertising cookies (e.g., conversion tracking)
- `analytics_storage`: Analytics cookies (GA4)
- `ad_user_data`: User data for advertising
- `ad_personalization`: Personalized ads

These update to "granted" only when user consents via Cookiebot.

### 3. Google Tag Manager (GTM)

GTM loads after Cookiebot and Consent Mode:

```typescript
{gtmId && (
  <Script
    id="google-tag-manager"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `,
    }}
  />
)}
```

Plus noscript fallback in `<body>`:

```html
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0"
    width="0"
    style={{ display: 'none', visibility: 'hidden' }}
  />
</noscript>
```

### 4. SPA Page View Tracking

Next.js App Router doesn't trigger page views on client-side navigation. We track them with a custom component.

`components/analytics/GTMPageView.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const pagePath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
```

#### How It Works

1. Watches route changes via `usePathname()` and `useSearchParams()`
2. Pushes `page_view` event to dataLayer on every route change
3. GTM picks up this event and fires GA4 page view tag (if consent granted)

Mounted once in `app/(site)/layout.tsx`.

### 5. Cookie Preferences UI

Users can change consent at any time via footer link:

```typescript
<button
  onClick={() => {
    if (typeof window !== 'undefined' && (window as any).Cookiebot) {
      (window as any).Cookiebot.show();
    }
  }}
  className="text-[0.875rem] hover:opacity-70 transition-opacity"
  style={{ color: 'var(--accent)' }}
>
  Cookie Preferences
</button>
```

This reopens the Cookiebot consent banner.

## Cookiebot Configuration (External)

### 1. Create Cookiebot Account

1. Go to https://www.cookiebot.com/
2. Sign up for free account (up to 100 pages free)
3. Add your domain
4. Get your **Domain Group ID** (CBID)

### 2. Enable Google Consent Mode

In Cookiebot admin panel:

1. Go to **Settings** → **Consent Mode**
2. Toggle **"Enable Google Consent Mode"**
3. Verify mappings:
   - **Statistics** → `analytics_storage`
   - **Marketing** → `ad_storage`, `ad_user_data`, `ad_personalization`

This mapping is automatic when enabled.

### 3. Configure Cookie Categories

Assign cookies to categories:

- **GA4 cookies** (`_ga`, `_ga_*`) → Statistics
- **GTM cookie** (`_gcl_au`) → Marketing (if using Google Ads)

Cookiebot auto-detects most Google cookies.

### 4. Customize Banner

Customize consent banner:
- Logo
- Colors
- Text
- Languages

Ensure it matches your site design.

## GTM Configuration (External)

### 1. Create GTM Container

1. Go to https://tagmanager.google.com/
2. Create new container
3. Choose **Web** as target platform
4. Get your **GTM-XXXXXXX** container ID

### 2. Create GA4 Configuration Tag

**Tag Configuration:**
- Tag Type: **Google Analytics: GA4 Configuration**
- Measurement ID: Your GA4 property ID (`G-XXXXXXXXXX`)

**Triggering:**
- Trigger: **All Pages**

**Advanced Settings → Consent Settings:**
- Add consent requirement: **analytics_storage = granted**

This ensures GA4 only fires when user has consented to analytics.

### 3. Create Page View Event Tag

**Tag Configuration:**
- Tag Type: **Google Analytics: GA4 Event**
- Configuration Tag: Select your GA4 Configuration tag
- Event Name: `page_view`

**Triggering:**
- Trigger Type: **Custom Event**
- Event name: `page_view`

**Consent Settings:**
- Require: **analytics_storage = granted**

This listens for the `page_view` event from our GTMPageView component.

### 4. Test Configuration

1. In GTM, click **Preview**
2. Enter your site URL
3. Check that:
   - Tags don't fire before consent
   - Tags fire after granting consent
   - Page views are tracked on navigation

## Environment Variables

Add to `.env.local`:

```bash
# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Cookiebot Domain Group ID
NEXT_PUBLIC_COOKIEBOT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Site URL (for metadata)
NEXT_PUBLIC_SITE_URL=https://practicalprague.com
```

Add to `.env.local.example` for team documentation.

## GDPR Compliance Checklist

### Technical Compliance

- [x] No cookies set before consent (Cookiebot blocking mode)
- [x] Consent defaults to "denied" (Google Consent Mode v2)
- [x] Users can withdraw consent (Cookie Preferences link)
- [x] Consent is granular (Statistics vs Marketing categories)
- [x] No analytics tracking without consent
- [x] Cookie banner appears on first visit
- [x] Consent persists across sessions (Cookiebot cookie)

### Legal Compliance

Required pages (create these separately):

- [ ] Privacy Policy page explaining data collection
- [ ] Cookie Policy page listing all cookies
- [ ] Terms of Service (if applicable)

Link these in footer alongside Cookie Preferences.

### Best Practices

- [x] Consent banner is not a "cookie wall" (users can decline)
- [x] Accept/Reject buttons are equally prominent
- [x] Purpose of cookies is clearly explained
- [x] Users can access preferences after initial consent
- [x] No pre-checked boxes in consent settings

## Testing & Debugging

### 1. Test Consent Flow

**Before Consent:**
1. Open site in incognito window
2. Open DevTools → Network tab
3. Filter by "google-analytics.com"
4. Verify no GA requests are made

**After Consent:**
1. Click "Accept" in Cookiebot banner
2. Check Network tab again
3. Verify GA4 requests now appear

### 2. Test GTM in Preview Mode

1. Go to GTM → Preview
2. Enter your site URL
3. Test consent scenarios:
   - Decline all → No tags fire
   - Accept statistics → GA4 fires
   - Accept marketing → Ad tags fire (if configured)

### 3. Verify Consent Mode Updates

In browser console:

```javascript
// Check dataLayer
console.log(window.dataLayer);

// Should show consent state updates after user interaction
// Example:
// { event: "consent", "gtm.uniqueEventId": 1, consent: "update", ... }
```

### 4. Check Cookie Storage

DevTools → Application → Cookies:

**Before Consent:**
- Only `CookieConsent` cookie (from Cookiebot)

**After Consent (Statistics):**
- `_ga` - GA4 client ID
- `_ga_XXXXXXXXXX` - GA4 property ID
- No ad cookies if marketing declined

### 5. Validate with Browser Extensions

Install browser extensions:
- **Cookiebot Checker** - Verifies Cookiebot implementation
- **Google Tag Assistant** - Debugs GTM/GA4 tags
- **Consent Mode Checker** - Validates Consent Mode v2

## Common Issues & Solutions

### Issue: GA4 fires before consent

**Cause**: GTM tag doesn't have consent requirement

**Solution**: In GTM, edit GA4 tag → Advanced Settings → Consent Settings → Add `analytics_storage = granted`

### Issue: Page views not tracking on navigation

**Cause**: GTMPageView component not mounted

**Solution**: Verify `<GTMPageView />` is in `app/(site)/layout.tsx` and component is client-side (`'use client'`)

### Issue: Cookiebot banner doesn't appear

**Causes:**
1. Invalid CBID
2. Domain not verified in Cookiebot
3. Ad blocker

**Solutions:**
1. Check `NEXT_PUBLIC_COOKIEBOT_ID` matches dashboard
2. Add domain in Cookiebot settings
3. Test with ad blocker disabled

### Issue: Consent not persisting

**Cause**: Cookie domain mismatch

**Solution**: In Cookiebot settings, verify domain matches your site exactly (with/without www)

### Issue: GTM not loading

**Causes:**
1. Invalid GTM ID
2. Ad blocker
3. Content Security Policy

**Solutions:**
1. Verify `NEXT_PUBLIC_GTM_ID` format: `GTM-XXXXXXX`
2. Test with ad blocker disabled
3. Check CSP headers don't block GTM domain

## Performance Considerations

### Impact on Core Web Vitals

**With this implementation:**
- ✅ Cookiebot script: ~15KB gzipped
- ✅ GTM script: ~35KB gzipped
- ✅ GA4 script: ~50KB gzipped (only if consent granted)

**Loading Strategy:**
- Cookiebot: `beforeInteractive` (necessary for blocking)
- Consent Mode: `beforeInteractive` (sets defaults)
- GTM: `afterInteractive` (deferred, non-blocking)

**Impact:**
- Minimal impact on LCP (scripts deferred)
- No impact on CLS (no layout shift)
- Small impact on FID (scripts load after interactive)

### Optimization Tips

1. **Lazy load GTM on interaction**: Only load GTM after first user interaction (advanced)
2. **Use server-side GTM**: Move tagging to server for better performance (complex setup)
3. **Limit GTM tags**: Only add necessary tags, remove unused ones
4. **Enable GTM caching**: Use CDN for GTM script

## Analytics Best Practices

### 1. Respect User Privacy

- Only collect necessary data
- Anonymize IP addresses (GA4 does this by default)
- Respect Do Not Track signals
- Don't collect PII in analytics

### 2. Be Transparent

- Clearly explain data collection in Privacy Policy
- List all cookies with purposes
- Provide opt-out mechanism
- Respond to data deletion requests

### 3. Monitor Consent Rates

In Cookiebot dashboard:
- Track acceptance rate
- Monitor category-specific consent
- Test different banner copy
- Optimize for higher consent (without being pushy)

### 4. Clean Data Collection

In GA4:
- Use events for user actions (clicks, form submissions)
- Set up custom dimensions for content categories
- Configure enhanced measurement (scrolls, outbound clicks)
- Exclude admin/preview traffic

## Future Enhancements

### Short-term

- [ ] Add Meta Pixel (Facebook/Instagram ads) - requires marketing consent
- [ ] Implement server-side tracking for better accuracy
- [ ] Add custom GTM variables (user ID, content category)
- [ ] Set up GA4 custom events (newsletter signup, article reading time)

### Long-term

- [ ] Implement consent-mode conversion modeling (predictive)
- [ ] Add first-party data collection (newsletter subscriber tracking)
- [ ] Implement cookieless tracking fallback
- [ ] Create analytics dashboard for key metrics
- [ ] Add A/B testing framework (respecting consent)

## Resources

### Documentation

- [Google Consent Mode v2](https://support.google.com/tagmanager/answer/10718549)
- [Cookiebot Documentation](https://www.cookiebot.com/en/developer/)
- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

### Compliance

- [GDPR Official Text](https://gdpr.eu/)
- [ePrivacy Directive](https://ec.europa.eu/digital-single-market/en/eprivacy-directive)
- [Cookie Compliance Guide](https://www.cookiebot.com/en/gdpr-cookies/)

### Tools

- [GTM Preview Mode](https://tagmanager.google.com/)
- [GA4 DebugView](https://analytics.google.com/)
- [Cookiebot Checker Extension](https://chrome.google.com/webstore)
- [Tag Assistant Legacy](https://chrome.google.com/webstore)

## Support

For issues with:
- **Cookiebot**: support@cookiebot.com
- **GTM/GA4**: Google Analytics Help Center
- **Implementation**: Create issue in this repository
