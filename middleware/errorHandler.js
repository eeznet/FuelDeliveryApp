const winston = require('winston');
require('winston-daily-rotate-file');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log', // Create new log file each day
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Keep logs for the past 14 days
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...rest }) => {
      return `[${timestamp}] ${level}: ${message} ${Object.keys(rest).length ? JSON.stringify(rest) : ''}`;
    })
  ),
});

// Express Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error (Stack trace only in development)
  logger.error({
    message,
    status: statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Send appropriate error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { error: err.message, stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
