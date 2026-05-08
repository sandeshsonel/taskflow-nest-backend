import appConfig from './app.config';
import authConfig from './auth.config';
import cacheConfig from './cache.config';
import databaseConfig from './database.config';
import firebaseConfig from './firebase.config';
import redisConfig from './redis.config';
import throttlerConfig from './throttler.config';

export { validate } from './env.validation';

export const configs = [
  appConfig,
  authConfig,
  cacheConfig,
  databaseConfig,
  firebaseConfig,
  redisConfig,
  throttlerConfig,
];
