const winston = require('winston');
const { LOG_LEVEL, LOG_FILE } = require('../config');

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: LOG_FILE })
  ]
});

module.exports = logger;
