import { Injectable, LoggerService } from '@nestjs/common';
import Logger from '../../utils/logger';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    Logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    Logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    Logger.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    Logger.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    Logger.verbose(message, ...optionalParams);
  }
}
