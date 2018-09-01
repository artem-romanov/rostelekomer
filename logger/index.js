const { createLogger, format, transports } = require('winston');

const { printf, combine, timestamp } = format;

const logFormat = printf((info) => {
  return `>> ${info.timestamp}: ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: './logs/logs.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console({
    }),
  ]
});

module.exports = logger;
