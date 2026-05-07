import { NestFactory } from '@nestjs/core';
import {
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // I18n-aware validation: translates class-validator messages
  // based on the request's resolved locale.
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Converts I18nValidationException into a structured JSON response
  // with translated error messages.
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
