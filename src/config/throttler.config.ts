import { registerAs } from '@nestjs/config';

export default registerAs('throttler', () => ({
  ttl: parseInt(process.env.THROTTLER_TTL || '60000', 10),
  limit: parseInt(process.env.THROTTLER_LIMIT || '10', 10),
  redis: {
    enabled: process.env.THROTTLER_REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
}));
