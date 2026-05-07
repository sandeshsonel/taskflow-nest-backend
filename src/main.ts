import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/swagger.config';
import { setupCors } from './common/configs/cors.config';
import { WinstonLoggerService } from '@modules';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust proxy for rate limiting (X-Forwarded-For)
  // Enable real client IP detection behind proxy/load balancer
  app.set('trust proxy', 1);

  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  // ──────────────────────────────────────────────────────
  //  Configurations
  // ──────────────────────────────────────────────────────
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

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
