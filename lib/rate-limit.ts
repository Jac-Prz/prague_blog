// Simple in-memory rate limiter for admin auth
// In production, consider using Redis or similar

type RateLimitEntry = {
  attempts: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export function checkRateLimit(identifier: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous attempts or window expired
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      resetAt: now + 15 * 60 * 1000, // 15 minute window
    });
    return { allowed: true };
  }

  // Too many attempts
  if (entry.attempts >= 5) {
    return { allowed: false, resetAt: entry.resetAt };
  }

  // Increment attempts
  entry.attempts++;
  rateLimitStore.set(identifier, entry);
  return { allowed: true };
}

export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
