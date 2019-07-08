"use strict";
const winston = require("winston");

const logsDir = "./logs/";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: logsDir + "error.log",
      level: "error"
    })
  ]
});

module.exports = logger;
