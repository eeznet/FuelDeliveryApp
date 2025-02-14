import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";

// Determine file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log directory
const logDirectory = path.join(__dirname, "../logs");

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Set dynamic log level (default: "info")
const logLevel = process.env.LOG_LEVEL || "info";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}] (PID: ${process.pid}): ${message}`;
    if (Object.keys(metadata).length) {
      msg += ` | Metadata: ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create Winston logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});

// Enable file logging except in Jest test environments
if (process.env.NODE_ENV !== "test") {
  logger.add(
    new DailyRotateFile({
      filename: path.join(logDirectory, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "14d", // Keep logs for 14 days
    })
  );

  logger.add(
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    })
  );
}

export default logger;
