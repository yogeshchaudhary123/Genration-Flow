// In-memory rate limiting map. For production in Vercel, consider Upstash Redis.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Basic in-memory rate limiter
 * @param ip IP address of the request
 * @param limit Max requests per window
 * @param windowMs Window size in milliseconds
 * @returns Object indicating if request is allowed
 */
export const rateLimit = (ip: string, limit = 100, windowMs = 60000) => {
  const now = Date.now();
  const windowData = rateLimitMap.get(ip);

  if (!windowData) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return { success: true };
  }

  if (now - windowData.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return { success: true };
  }

  if (windowData.count >= limit) {
    return { success: false };
  }

  windowData.count += 1;
  return { success: true };
};

/**
 * Extracts IP from request headers
 */
export const getIp = (req: Request) => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
  return ip;
};
