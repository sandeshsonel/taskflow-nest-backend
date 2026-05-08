import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Public } from '@modules/auth';
import { DEFAULT_API_VERSION } from '@common/constants';

@ApiTags('App')
@Controller({ version: DEFAULT_API_VERSION })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'API root',
    description:
      'Returns basic API metadata — name, version, docs URL, and server time.',
  })
  @ApiResponse({ status: 200, description: 'API metadata.' })
  getRoot() {
    return this.appService.getApiInfo();
  }
}
