import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { AppModule } from './app.module';
import { WinstonLoggerService } from '@modules';

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
  const swaggerConfig = new DocumentBuilder()
    .setTitle('X-Name API')
    .setDescription(
      'REST API documentation for the X-Name backend — covering authentication, account management, and more.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'JWT-auth', // security name referenced by @ApiBearerAuth('JWT-auth')
    )
    .addTag('App', 'Root endpoint & API metadata')
    .addTag('Health', 'Liveness, readiness & dependency health checks')
    .addTag('Account', 'User registration, login & profile management')
    .addTag('Bug Report', 'Public endpoint for reporting bugs and issues')
    .addTag('Task', 'Task management and assignments')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'X-Name API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
