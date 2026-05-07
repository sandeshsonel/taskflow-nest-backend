import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { AppModule } from './app.module';
import { WinstonLoggerService } from '@modules';

import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

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

  // ──────────────────────────────────────────────────────
  //  Swagger / OpenAPI Documentation
  // ──────────────────────────────────────────────────────
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
