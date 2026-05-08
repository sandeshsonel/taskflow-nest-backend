import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  /**
   * Returns lightweight API metadata for the root endpoint.
   * Useful for developers and automated tooling to confirm the API
   * identity and discover the docs URL.
   */
  getApiInfo() {
    const apiPrefix = this.config.get<string>('app.apiPrefix', 'api');
    return {
      name: 'TaskFlow Nest API',
      version: this.config.get<string>('app.version', '1.0.0'),
      environment: this.config.get<string>('app.environment', 'development'),
      docs: `/${apiPrefix}/docs`,
      timestamp: new Date().toISOString(),
    };
  }
}
