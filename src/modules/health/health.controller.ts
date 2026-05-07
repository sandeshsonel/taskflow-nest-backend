import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

import { Public } from '../auth';
import { PublicRoute } from '../../common/throttler/throttler.decorators';
import { HealthCheckResponseDto } from './dto/health-response.dto';

/**
 * Exposes application health information for load-balancers,
 * orchestrators (K8s liveness/readiness probes), and monitoring dashboards.
 *
 * GET /health → aggregated health of all critical dependencies.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Public()
  @PublicRoute()
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Application health check',
    description:
      'Returns the aggregated health status of the application and its ' +
      'dependencies (database, memory, disk). Designed for use with ' +
      'Kubernetes liveness/readiness probes and load-balancer health checks.',
  })
  @ApiResponse({
    status: 200,
    description: 'All health indicators are healthy.',
    type: HealthCheckResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'One or more health indicators are unhealthy.',
    type: HealthCheckResponseDto,
  })
  check() {
    return this.health.check([
      // ── Database ──────────────────────────────────────────
      // Verifies the MongoDB connection is alive via a ping command.
      () => this.mongoose.pingCheck('database', { timeout: 3000 }),

      // ── Memory: Heap ──────────────────────────────────────
      // Fails if V8 heap usage exceeds 512 MB — helps detect memory leaks.
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),

      // ── Memory: RSS ───────────────────────────────────────
      // Fails if total resident set size exceeds 1 GB.
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),

      // ── Disk Storage ──────────────────────────────────────
      // Fails if the root partition exceeds 90% usage.
      () =>
        this.disk.checkStorage('storage', {
          thresholdPercent: 0.9,
          path: process.platform === 'win32' ? 'C:\\' : '/',
        }),
    ]);
  }
}
