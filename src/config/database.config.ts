import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  name: process.env.MONGO_DB_NAME || '',
  uri:
    process.env.MONGO_URI ||
    `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}`,
  options: {
    minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || '5', 10),
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || '10', 10),
    serverSelectionTimeoutMS: 10_000, // Fail fast if no server is found within 10s
    connectTimeoutMS: 10_000, // Timeout individual socket connections after 10s
  },
}));
