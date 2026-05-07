import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

const environment = process.env.NODE_ENV || 'development';
const logDirectory = process.env.LOG_DIR || 'logs';

let dir = logDirectory;
if (!path.isAbsolute(dir)) dir = path.resolve(dir);

// create directory if it is not present
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const logLevel = environment === 'development' ? 'debug' : 'info';

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: path.join(dir, '%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
});

const Logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false, // do not exit on handled exceptions
});

export default Logger;
