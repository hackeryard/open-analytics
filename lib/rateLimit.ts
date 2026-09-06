/**
 * Production-ready in-memory sliding-window rate limiter.
 * Designed for serverless and Node.js runtimes to safeguard auth and API endpoints against brute force and DDoS.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);

  // Allow Node process to exit without being blocked by this timer
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

export interface RateLimitOptions {
  /**
   * Time window in seconds (e.g. 60 for 1 minute).
   * Default: 60
   */
  windowSeconds?: number;
  /**
   * Maximum allowed requests in the time window.
   * Default: 10
   */
  maxRequests?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and updates rate limit for a given client identifier (e.g., IP address or user ID).
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowSeconds = options.windowSeconds || 60;
  const maxRequests = options.maxRequests || 10;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetSeconds: windowSeconds,
    };
  }

  record.count += 1;
  const remaining = Math.max(0, maxRequests - record.count);
  const resetSeconds = Math.ceil((record.resetAt - now) / 1000);

  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
    };
  }

  return {
    allowed: true,
    remaining,
    resetSeconds,
  };
}

/**
 * Helper to extract client IP from NextRequest headers.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}
