import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  timezone: process.env.TZ || 'UTC',
  corsUrl: process.env.CORS_URL || '*',
  logDirectory: process.env.LOG_DIR || 'logs',
}));
