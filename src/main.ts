import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app.module';
import { setupCors } from './common/configs/cors.config';
import { setupSwagger } from './common/swagger/swagger.config';
import { WinstonLoggerService } from '@modules';

async function bootstrap() {
  const startupLogger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Trust proxy for rate limiting (X-Forwarded-For)
    // Enable real client IP detection behind proxy/load balancer
    app.set('trust proxy', 1);

    const logger = app.get(WinstonLoggerService);
    app.useLogger(logger);

    // ──────────────────────────────────────────────────────
    //  Configurations
    // ──────────────────────────────────────────────────────
    const configService = app.get(ConfigService);
    const apiPrefix = configService.get<string>('app.apiPrefix', 'api');
    const apiVersion = configService.get<string>('app.apiVersion', '1');

    app.setGlobalPrefix(apiPrefix);

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: apiVersion,
    });

    setupCors(app);
    setupSwagger(app);

    // I18n-aware validation: translates class-validator messages
    // based on the request's resolved locale.
    app.useGlobalPipes(
      new I18nValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Converts I18nValidationException into a structured JSON response
    // with translated error messages.
    app.useGlobalFilters(
      new I18nValidationExceptionFilter({
        detailedErrors: true,
      }),
    );

    const port = process.env.PORT ?? 8000;
    await app.listen(port);

    startupLogger.log(
      `Application started successfully on port ${port} [${process.env.NODE_ENV || 'development'}]`,
    );
  } catch (error) {
    startupLogger.error('APPLICATION FAILED TO START');
    startupLogger.error(
      error instanceof Error ? error.message : String(error),
    );

    if (
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('MongoServerSelectionError') ||
        error.message.includes('MongoNetworkError') ||
        error.message.includes('MONGO'))
    ) {
      startupLogger.error(
        'Hint: MongoDB appears to be unreachable. Verify that the database server is running and the MONGO_URI environment variable is correct.',
      );
    }

    if (error instanceof Error && error.message.includes('Redis')) {
      startupLogger.error(
        'Hint: Redis appears to be unreachable. If THROTTLER_REDIS_ENABLED=true, verify REDIS_HOST, REDIS_PORT, and that the Redis server is running.',
      );
    }

    process.exit(1);
  }
}

bootstrap();
