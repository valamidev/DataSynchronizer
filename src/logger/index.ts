import winston from 'winston';

const logsDir = './logs/';

const loggerLevel = process.env.logLevel || 'info';

export const logger = winston.createLogger({
  level: loggerLevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: loggerLevel,
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: `${logsDir}error.log`,
      level: 'error',
    }),
  ],
});
