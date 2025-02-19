import winston from 'winston';
const { createLogger, format, transports } = winston;

// Create a simpler logger for testing
const logger = createLogger({
    level: 'debug',
    format: format.simple(),
    transports: [
        new transports.Console()
    ]
});

// Handle uncaught exceptions
logger.exceptions.handle(
    new transports.File({ filename: 'logs/exceptions.log' })
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
});

export default logger; 