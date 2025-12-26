# Security Implementation Guide

## Overview

This document describes the security measures implemented for the Prague Blog admin system. The system uses a simple but secure authentication approach suitable for a single-admin blog.

## Security Features

### 1. HTTP-Only Cookies

All authentication is handled via HTTP-only cookies:

```typescript
// Set in app/api/admin/auth/route.ts
response.cookies.set('admin_auth', 'authenticated', {
  httpOnly: true,           // Prevents JavaScript access (XSS protection)
  secure: true,             // HTTPS only in production
  sameSite: 'strict',       // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7-day session
  path: '/',
});
```

**Benefits:**
- ✅ **XSS Protection:** JavaScript cannot access the cookie
- ✅ **CSRF Protection:** `sameSite: 'strict'` prevents cross-site requests
- ✅ **Transport Security:** `secure: true` ensures HTTPS in production
- ✅ **Proper Scoping:** `path: '/'` makes cookie available to all routes

### 2. Rate Limiting

Brute force protection with IP-based rate limiting:

```typescript
// lib/rate-limit.ts
- 5 login attempts per 15-minute window
- IP-based tracking (from x-forwarded-for or x-real-ip headers)
- Automatic cleanup of expired entries every hour
- Clear rate limit on successful login
```

**How It Works:**
1. Extract IP from request headers
2. Check if IP has exceeded rate limit
3. Return 429 error with time remaining if limited
4. Clear rate limit on successful authentication

**Error Response:**
```json
{
  "error": "Too many attempts. Try again in 12 minutes."
}
```

### 3. Password Hashing (Optional but Recommended)

Support for bcrypt-hashed passwords:

```typescript
// Supports both plain text and hashed passwords
if (ADMIN_PASSWORD.startsWith('$2a$') || ADMIN_PASSWORD.startsWith('$2b$')) {
  // Hashed password (bcrypt)
  isValid = await bcrypt.compare(password, ADMIN_PASSWORD);
} else {
  // Plain text password (backward compatibility)
  isValid = password === ADMIN_PASSWORD;
}
```

**To Hash Your Password:**

1. Use the helper script:
   ```bash
   node scripts/hash-password.js yourPasswordHere
   ```

2. Copy the output hash to your `.env.local`:
   ```env
   ADMIN_PASSWORD="$2a$10$..."
   ```

3. The system will automatically detect and use bcrypt comparison

**Benefits:**
- ✅ Password not stored in plain text
- ✅ Defense in depth if `.env.local` is compromised
- ✅ Industry-standard bcrypt algorithm
- ✅ Backward compatible with plain text passwords

### 4. Route Protection

Middleware protects all admin routes:

```typescript
// middleware.ts
export const config = {
  matcher: ['/admin/drafts/:path*', '/admin/draft/:path*']
};
```

**Protected Routes:**
- `/admin/drafts` - List of all draft posts
- `/admin/draft/[slug]` - Individual draft preview

**How It Works:**
1. Check for `admin_auth` cookie
2. Verify value is `'authenticated'`
3. Redirect to `/admin` if not authenticated

### 5. No Session Storage

**❌ Removed:** `sessionStorage` dependencies (less secure, client-side)

**✅ Using:** HTTP-only cookies exclusively

**Why This Matters:**
- Session storage is accessible via JavaScript (XSS vulnerability)
- Cookies with `httpOnly: true` are not accessible to JavaScript
- Server-side validation via middleware is more secure

## Security Checklist

When deploying to production:

- [ ] Set strong password in environment variables
- [ ] Use hashed password (run `node scripts/hash-password.js`)
- [ ] Verify `ADMIN_PASSWORD` is in `.env.local` (never committed to Git)
- [ ] Ensure HTTPS is enabled (Vercel does this automatically)
- [ ] Test rate limiting (try 5+ failed logins)
- [ ] Verify cookie settings (`secure: true` in production)
- [ ] Check middleware protection (try accessing `/admin/drafts` logged out)

## Testing Security

### Test Rate Limiting

1. Open `/admin`
2. Enter wrong password 5 times
3. Should see: "Too many attempts. Try again in X minutes"
4. Wait 15 minutes or restart server to reset

### Test Cookie Security

1. Login successfully at `/admin`
2. Open browser DevTools → Application → Cookies
3. Verify `admin_auth` cookie has:
   - ✅ HttpOnly flag
   - ✅ Secure flag (in production)
   - ✅ SameSite: Strict

### Test Middleware Protection

1. Logout or clear cookies
2. Try accessing `/admin/drafts` directly
3. Should redirect to `/admin`
4. Try accessing `/admin/draft/some-slug`
5. Should redirect to `/admin`

### Test Session Duration

1. Login successfully
2. Wait more than 7 days
3. Cookie should expire and redirect to login

## Common Issues

### Issue: Rate limit not working

**Symptoms:** Can attempt login unlimited times

**Possible Causes:**
- Rate limit store is in-memory (resets on server restart)
- Multiple server instances (each has own store)

**Solutions:**
- For production with multiple instances, use Redis
- For single-instance deployment (Vercel), in-memory is fine

### Issue: Redirects after successful login

**Symptoms:** Logged in but still redirected to `/admin`

**Possible Causes:**
- Cookie path mismatch
- Middleware not recognizing cookie

**Solutions:**
- Verify cookie has `path: '/'`
- Check browser DevTools for cookie presence
- Clear cookies and try again

### Issue: "Admin password not configured"

**Symptoms:** 500 error when logging in

**Possible Causes:**
- `ADMIN_PASSWORD` not set in environment variables

**Solutions:**
- Add to `.env.local`: `ADMIN_PASSWORD="yourpassword"`
- Or use hashed: `ADMIN_PASSWORD="$2a$10..."`
- Restart development server

## Security Best Practices

### ✅ DO:
- Use a strong, unique password (20+ characters)
- Hash your password with bcrypt
- Keep `.env.local` out of version control (in `.gitignore`)
- Use HTTPS in production (Vercel does this automatically)
- Enable 2FA on your Vercel account
- Regularly update dependencies (`npm audit`)

### ❌ DON'T:
- Store passwords in plain text in production
- Share admin credentials
- Commit `.env.local` to Git
- Disable HTTPS in production
- Use weak passwords ("admin", "password123", etc.)
- Reuse passwords from other services

## Comparison: Current vs. NextAuth

### Current Implementation (Simple Auth)

**Pros:**
- ✅ Simple and lightweight
- ✅ No external dependencies (except bcrypt)
- ✅ Fast to implement
- ✅ Perfect for single admin
- ✅ Full control over behavior

**Cons:**
- ⚠️ Not suitable for multiple users
- ⚠️ No OAuth/social login
- ⚠️ Manual password management

### NextAuth (Full Auth Library)

**Pros:**
- ✅ Multiple users with roles
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ Database session management
- ✅ Email verification
- ✅ Password reset flows

**Cons:**
- ⚠️ Complex setup
- ⚠️ Requires database
- ⚠️ Overkill for single admin
- ⚠️ More dependencies to maintain

### Recommendation

For a single-admin blog like Prague Blog:
- **Current approach is sufficient** ✅
- Simple, secure, and maintainable
- Already implements best practices:
  - HTTP-only cookies
  - Rate limiting
  - Password hashing
  - Route protection

**When to consider NextAuth:**
- Multiple admin users with different permissions
- Need OAuth login (Google, GitHub, etc.)
- User registration/password reset features
- Team collaboration features

## Environment Variables

Required environment variables for admin system:

```env
# .env.local (never commit this file!)

# Plain text password (not recommended for production)
ADMIN_PASSWORD="your-secure-password-here"

# OR hashed password (recommended)
# Generate with: node scripts/hash-password.js yourPasswordHere
ADMIN_PASSWORD="$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

## Rate Limiting Configuration

Current configuration in `lib/rate-limit.ts`:

```typescript
const MAX_ATTEMPTS = 5;              // Maximum failed attempts
const WINDOW_MS = 15 * 60 * 1000;    // 15-minute window
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Cleanup every hour
```

**To Adjust:**
- Change `MAX_ATTEMPTS` for stricter/looser limits
- Change `WINDOW_MS` for shorter/longer lockout periods
- Change `CLEANUP_INTERVAL` for memory management

## Future Enhancements (Optional)

If you need more security in the future:

1. **Redis-based rate limiting**
   - For multi-instance deployments
   - Persistent rate limit tracking

2. **Session management**
   - Track active sessions in database
   - Remote logout capability
   - Session history/audit log

3. **Two-factor authentication (2FA)**
   - TOTP-based (Google Authenticator, Authy)
   - SMS/email verification

4. **IP whitelisting**
   - Only allow access from specific IPs
   - Useful if you always work from same location

5. **Audit logging**
   - Log all login attempts
   - Track admin actions
   - Monitor suspicious activity

## Support

For security questions or issues:
1. Check this documentation
2. Review error messages in browser DevTools
3. Check server logs in Vercel dashboard
4. Test locally before deploying

## Last Updated

This document was last updated with the security improvements implemented on the current date.
