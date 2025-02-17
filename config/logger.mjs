import winston from 'winston';
const { createLogger, format, transports } = winston;

// Create the logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
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