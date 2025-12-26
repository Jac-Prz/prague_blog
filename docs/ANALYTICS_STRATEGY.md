# Analytics & Tracking Strategy — Practical Prague

This document defines the **analytics, tracking, and attribution strategy** for Practical Prague.

The goal is to understand **where visitors come from, how content performs, and how social platforms contribute**, while keeping the site fast, privacy-aware, and editorially focused.

This is a **publisher-first setup**, not a growth-hacking system.

---

## Goals

We want to answer three core questions:

1. **Where are visitors coming from?**
   - Google Search
   - Direct traffic
   - Referrals from other websites
   - Instagram, Facebook, and other social platforms

2. **What content performs well?**
   - Which articles are read
   - Which categories attract readers
   - How users move from homepage → category → article

3. **Does social traffic matter?**
   - Do Instagram and Facebook send meaningful readers?
   - Which placements (bio, story, post) perform best?

We are explicitly **not** trying to:
- track individual users
- build funnels or conversions
- optimize for ads
- collect excessive behavioral data

---

## Tooling Overview

### Chosen Stack

- **Google Analytics 4 (GA4)**  
  Primary analytics platform and single source of truth.

- **Google Tag Manager (GTM)**  
  Tag delivery layer and future-proofing tool.

---

## Why Google Tag Manager (GTM)

GTM is included **not because we need complexity now**, but because it:

- avoids refactoring analytics code later
- allows adding or adjusting tracking without redeploys
- supports future tools (Meta Pixel, outbound click tracking)
- keeps analytics separate from application logic

At launch, GTM will be used in a **minimal configuration**.

---

## GA4 Configuration (Initial Phase)

### What We Track by Default

GA4 automatically tracks:
- page views
- referral source and medium
- landing pages
- device type
- geography
- basic engagement metrics

This is sufficient for launch.

### What We Do NOT Track Initially

- custom events
- scroll depth
- video engagement
- outbound link clicks
- conversion funnels

These may be added later only if there is a clear need.

---

## Referral & Source Tracking

### Organic & Referral Traffic

GA4 automatically captures:
- `google / organic`
- `direct`
- `referral` (other websites)

No additional configuration required.

---

## Social Traffic Tracking (Critical)

**UTM parameters are mandatory for all social links.**

Without UTMs:
- Instagram and Facebook traffic is often misclassified as “Direct”
- performance cannot be evaluated accurately

---

## UTM Naming Convention

All social links must follow this structure:
https://practicalprague.com/article-slug

?utm_source=platform
&utm_medium=social
&utm_campaign=context


### Standard Examples

#### Instagram — Bio link
utm_source=instagram
utm_medium=social
utm_campaign=bio


#### Instagram — Story link
utm_source=instagram
utm_medium=social
utm_campaign=story

#### Facebook — Post link

utm_source=facebook
utm_medium=social
utm_campaign=post


This allows us to clearly determine:
- which platform sent the traffic
- how users encountered the link
- which placements are worth continuing

---

## Tracking Social Platforms

### Phase 1 (Launch)

- Use **GA4 + UTMs only**
- No Meta (Facebook) Pixel
- No advertising integrations

This keeps:
- privacy manageable
- performance fast
- complexity low

---

### Phase 2 (Optional, Later)

If social traffic grows meaningfully:
- Add Meta Pixel **via GTM**
- Use only for:
  - audience insights
  - optional retargeting

This is not required unless traffic justifies it.

---

## External Links & Embedded Content

### Philosophy

Referencing external creators or platforms is encouraged **when it adds value**.

However:
- Embeds do **not** directly improve SEO
- Over-embedding harms performance and clarity

---

### Current Policy

- Prefer **contextual links** over embeds
- Use embeds sparingly and intentionally
- Never embed content purely for promotion

---

### Embeds (Controlled)

- **YouTube** embeds are allowed via a dedicated block
  - lazy-loaded
  - no autoplay
  - one embed max per article recommended

- **Instagram / Facebook / Bluesky**
  - default to link-style references
  - full embeds only if absolutely necessary
  - heavy scripts should not load by default

---

## Outbound Click Tracking

### Current Decision

- Do **not** track outbound clicks initially
- Focus on content quality and referral traffic first

### Possible Future Enhancement

Via GTM, we may later:
- track outbound clicks to YouTube or referenced creators
- evaluate whether embeds provide real value

This should be driven by data, not assumptions.

---

## Privacy & Compliance (EU Context)

As the site operates in the EU:

- Use a simple cookie notice
- Avoid invasive tracking
- No fingerprinting
- No third-party scripts beyond GA4/GTM initially

This keeps the site:
- compliant
- fast
- trustworthy

---

## Implementation Summary

### Do Now
- Set up GA4
- Set up GTM
- Add GA4 Configuration tag via GTM
- Enforce UTM usage for all social links

### Do Later (If Needed)
- Meta Pixel via GTM
- outbound click tracking
- embed engagement events

---

## Guiding Principle

Analytics should **support editorial decisions**, not drive them.

If tracking does not lead to clearer decisions, it should not be added.

