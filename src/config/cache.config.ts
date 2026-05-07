import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  contentCacheDuration: parseInt(process.env.CONTENT_CACHE_DURATION_MILLIS || '600000', 10),
}));
