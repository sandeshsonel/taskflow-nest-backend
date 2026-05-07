import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';

/**
 * Encapsulates all health-check concerns.
 *
 * TerminusModule provides the built-in health indicators
 * (MongooseHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator)
 * so they are injectable in HealthController without explicit provider setup.
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
