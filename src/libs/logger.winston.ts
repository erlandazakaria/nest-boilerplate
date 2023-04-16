import { transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';

const WinstonLogger = WinstonModule.createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level} ${[info.context]}: ${
            info.message
          }`;
        }),
      ),
    }),
  ],
});

export default WinstonLogger;
