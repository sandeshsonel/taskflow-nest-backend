import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Connection } from 'mongoose';

@Injectable()
export class StartupDependencyService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StartupDependencyService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Running startup checks for external dependencies.');

    await this.verifyMongoDb();
    await this.verifyThrottlerRedis();

    this.logger.log('External dependency checks completed successfully.');
  }

  private async verifyMongoDb() {
    const readyState = this.connection.readyState;

    if (readyState !== 1) {
      throw new Error(
        `MongoDB connection is not ready (readyState: ${readyState}). ` +
          'Ensure the database is running and MONGO_URI is correct.',
      );
    }

    try {
      await this.connection.db.admin().ping();
      this.logger.log(`MongoDB connected successfully: ${this.connection.name}`);
    } catch (error) {
      throw new Error(
        'MongoDB ping failed during startup. The database may be unreachable. ' +
          this.formatError(error),
      );
    }
  }

  private async verifyThrottlerRedis() {
    const redisEnabled =
      this.configService.get<boolean>('throttler.redis.enabled') ?? false;

    if (!redisEnabled) {
      this.logger.log('Redis startup check skipped because throttler Redis is disabled.');
      return;
    }

    const host =
      this.configService.get<string>('throttler.redis.host') ?? 'localhost';
    const port = this.configService.get<number>('throttler.redis.port') ?? 6379;

    const client = new Redis({
      host,
      port,
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 5_000,
    });

    try {
      await client.connect();

      const response = await client.ping();

      if (response !== 'PONG') {
        throw new Error(`Unexpected Redis ping response: ${response}`);
      }

      this.logger.log(`Redis connected successfully: ${host}:${port}`);
    } catch (error) {
      throw new Error(
        `Redis is enabled for throttling but could not be reached at ${host}:${port}. ` +
          'Verify REDIS_HOST, REDIS_PORT, and the Redis server status. ' +
          this.formatError(error),
      );
    } finally {
      client.disconnect();
    }
  }

  private formatError(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
