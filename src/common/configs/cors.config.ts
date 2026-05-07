import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * ARCHITECT'S NOTE: Secure & Performant CORS Policy
 *
 * Implements a dual-layer origin validation strategy:
 * - O(1) Set lookups for static origins.
 * - Pre-compiled Regex for dynamic wildcards.
 *
 * Safety: Wildcard '*' is strictly forbidden in production.
 */
export function setupCors(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const logger = new Logger('CORS');

  const rawAllowedOrigins = configService.get<string[]>(
    'app.allowedOrigins',
  ) || ['*'];
  const isProduction = configService.get<boolean>('app.isProduction');

  // Pre-process origins during bootstrap to keep request cycles lean.
  const staticOrigins = new Set<string>();
  const regexOrigins: RegExp[] = [];

  rawAllowedOrigins.forEach((origin) => {
    // SECURITY: Production must never default to permissive wildcards.
    if (origin === '*') {
      if (!isProduction) staticOrigins.add('*');
      return;
    }

    if (origin.includes('*')) {
      // Pre-compile regex for performance; escape dots for strict matching.
      const pattern = `^${origin.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`;
      regexOrigins.push(new RegExp(pattern));
    } else {
      staticOrigins.add(origin);
    }
  });

  app.enableCors({
    origin: (origin, callback) => {
      // Permit non-browser agents (Mobile/Postman) which omit Origin headers.
      if (!origin) return callback(null, true);

      // Fast-path: Static match or dev-wildcard.
      if (staticOrigins.has(origin) || staticOrigins.has('*')) {
        return callback(null, true);
      }

      // Regex-path: Dynamic/Subdomain matching.
      const isDynamicAllowed = regexOrigins.some((regex) => regex.test(origin));
      if (isDynamicAllowed) return callback(null, true);

      // Log violation for security auditing.
      logger.warn(`CORS blocked unauthorized origin: ${origin}`);
      return callback(new Error('CORS Policy: Origin not allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'X-XSRF-TOKEN',
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true, // Required for secure session cookies.
    maxAge: 3600, // Cache preflight for 1 hour.
  });
}
