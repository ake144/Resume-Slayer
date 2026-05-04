import crypto from "crypto";

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; resetAt: number };

const DEFAULT_WINDOW_MS = 2 * 60 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 2;

const globalState = globalThis as typeof globalThis & {
  __slayerRateLimitStore?: Map<string, RateLimitState>;
};

const store = globalState.__slayerRateLimitStore ?? new Map<string, RateLimitState>();

if (!globalState.__slayerRateLimitStore) {
  globalState.__slayerRateLimitStore = store;
}

const getWindowMs = () => {
  const configured = Number(process.env.SLAYER_RATE_LIMIT_WINDOW_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_WINDOW_MS;
};

const getMaxRequests = () => {
  const configured = Number(process.env.SLAYER_RATE_LIMIT_MAX_REQUESTS);
  return Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : DEFAULT_MAX_REQUESTS;
};

const hashValue = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

const extractClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for") || request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip") || request.headers.get("X-Real-IP") || null;
};

export const isInternalSlayerRequest = (request: Request) => {
  return request.headers.get("x-slayer-internal") === "1";
};

export const getSlayerQuotaIdentity = (request: Request) => {
  const token = request.headers.get("authorization") || request.headers.get("Authorization");
  if (token) {
    return {
      scope: "user" as const,
      key: `slayer:user:${hashValue(token.trim())}`,
    };
  }

  const clientIp = extractClientIp(request);
  if (clientIp) {
    return {
      scope: "ip" as const,
      key: `slayer:ip:${hashValue(clientIp)}`,
    };
  }

  return {
    scope: "anonymous" as const,
    key: "slayer:anonymous",
  };
};

export const checkSlayerRateLimit = (identityKey: string): RateLimitResult => {
  const now = Date.now();
  const windowMs = getWindowMs();
  const maxRequests = getMaxRequests();

  const current = store.get(identityKey);
  if (!current || current.resetAt <= now) {
    store.set(identityKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds, resetAt: current.resetAt };
  }

  current.count += 1;
  store.set(identityKey, current);
  return { allowed: true };
};

export const buildSlayerRateLimitHeaders = (retryAfterSeconds: number, resetAt: number) => ({
  "Retry-After": String(retryAfterSeconds),
  "X-RateLimit-Reset": String(Math.floor(resetAt / 1000)),
});
