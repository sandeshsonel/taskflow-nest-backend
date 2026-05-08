import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, SwaggerDocumentOptions } from '@nestjs/swagger';
import { swaggerTags } from './swagger.tags';

/**
 * Sets up Swagger UI for the application.
 * @param app - The NestJS application instance.
 */
export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api');
  const apiVersion = configService.get<string>('app.apiVersion', '1');
  const appVersion = configService.get<string>('app.version', '1.0.0');

  const config = new DocumentBuilder()
    .setTitle('TaskFlow Nest API')
    .setDescription(
      'REST API documentation for the X-Name backend — covering authentication, account management, and more.',
    )
    .setVersion(appVersion)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'JWT-auth',
    )
    .addServer(`/${apiPrefix}/v${apiVersion}`, 'Current API Version')
    .addServer('/', 'Root Server');

  // Dynamically register all tags from our registry
  swaggerTags.forEach((tag) => {
    config.addTag(tag.name, tag.description);
  });

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };

  const document = SwaggerModule.createDocument(app, config.build(), options);

  const swaggerPath = `${apiPrefix}/docs`;
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'X-Name API Docs',
    customJs: [
      '/swagger-static/swagger-ui-bundle.js',
      '/swagger-static/swagger-ui-standalone-preset.js',
    ],
    customCssUrl: [
      '/swagger-static/swagger-ui.css',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
}
