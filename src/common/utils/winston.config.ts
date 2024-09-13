import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const isProduction = process.env['NODE_ENV'] === 'prod';

const dailyOptions = {
  filename: '%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14', // 더 많은 일수 보관
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
};

const consoleOptions = {
  level: isProduction ? 'warn' : 'info',
  format: isProduction
    ? winston.format.simple()
    : winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('TravelTalesApp', {
          colors: true,
          prettyPrint: true,
        }),
      ),
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console(consoleOptions),
    new winstonDaily(dailyOptions),
  ],
});
