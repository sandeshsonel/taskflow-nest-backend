import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerTags } from './swagger.tags';

/**
 * Sets up Swagger UI for the application.
 * @param app - The NestJS application instance.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
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
      'JWT-auth', // This name MUST match @ApiBearerAuth('JWT-auth') in controllers
    );

  // Dynamically register all tags from our registry
  swaggerTags.forEach((tag) => {
    config.addTag(tag.name, tag.description);
  });

  const document = SwaggerModule.createDocument(app, config.build());

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
}
