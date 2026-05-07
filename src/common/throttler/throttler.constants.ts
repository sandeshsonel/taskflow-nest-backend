export const THROTTLER_LIMITS = {
  SHORT: {
    ttl: 1000, // 1 second
    limit: 5,
  },
  MEDIUM: {
    ttl: 60000, // 1 minute
    limit: 60,
  },
  LONG: {
    ttl: 3600000, // 1 hour
    limit: 1000,
  },
  AUTH: {
    ttl: 60000, // 1 minute
    limit: 5,
  },
  REGISTRATION: {
    ttl: 3600000, // 1 hour
    limit: 3,
  },
  PASSWORD_RESET: {
    ttl: 3600000, // 1 hour
    limit: 2,
  },
  PUBLIC: {
    ttl: 60000, // 1 minute
    limit: 100,
  },
  INTERNAL: {
    ttl: 60000, // 1 minute
    limit: 1000,
  },
};

export const THROTTLER_SKIP_IF_KEY = 'is_throttler_skipped';
