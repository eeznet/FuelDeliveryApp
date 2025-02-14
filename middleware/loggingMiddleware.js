const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

// Ensure the logs directory exists
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a rotating log stream for production using Winston
const logFormat = ':remote-addr - :method :url :status :response-time ms - :res[content-length] [:date[iso]]';

// Daily rotation of access logs using Winston
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d', // Keep logs for the past 14 days
});

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }),
    dailyRotateFileTransport,
  ],
});

// Custom logging format
const loggingMiddleware = morgan(logFormat, {
  stream: process.env.NODE_ENV === 'production' ? logger.transports[1].stream : process.stdout,
});

module.exports = loggingMiddleware;
