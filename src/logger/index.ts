import winston from 'winston'

const logsDir = './logs/';

const logger_level = process.env.log_level || 'info';

export const logger = winston.createLogger({
  level: logger_level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: logger_level,
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: logsDir + 'error.log',
      level: 'error',
    }),
  ],
});


