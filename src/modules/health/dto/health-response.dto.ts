import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Represents the health status of a single dependency (e.g. database, disk, memory).
 */
export class HealthIndicatorDetail {
  @ApiProperty({
    description: 'Health status of this indicator',
    enum: ['up', 'down'],
    example: 'up',
  })
  status: 'up' | 'down';

  @ApiPropertyOptional({
    description: 'Additional diagnostic info (varies by indicator)',
    type: 'object',
    example: { message: 'Connection is alive' },
    additionalProperties: true,
  })
  details?: Record<string, unknown>;
}

/**
 * Top-level health check response conforming to the Terminus standard shape.
 */
export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Overall health status of the application',
    enum: ['ok', 'error', 'shutting_down'],
    example: 'ok',
  })
  status: 'ok' | 'error' | 'shutting_down';

  @ApiPropertyOptional({
    description: 'Per-indicator health details',
    type: 'object',
    example: {
      database: { status: 'up' },
      memory_heap: { status: 'up' },
      memory_rss: { status: 'up' },
      storage: { status: 'up' },
    },
    additionalProperties: true,
  })
  info?: Record<string, HealthIndicatorDetail>;

  @ApiPropertyOptional({
    description: 'Indicators that returned errors',
    type: 'object',
    example: {},
    additionalProperties: true,
  })
  error?: Record<string, HealthIndicatorDetail>;

  @ApiPropertyOptional({
    description: 'Combined view of all indicator details',
    type: 'object',
    additionalProperties: true,
  })
  details?: Record<string, HealthIndicatorDetail>;
}
