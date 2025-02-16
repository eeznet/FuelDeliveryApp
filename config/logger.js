import { createLogger, format, transports } from 'winston';
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
const logFormat = format.combine(
  format.timestamp(),
  format.json()
);

// Create Winston logger instance
const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new transports.Console()
  ]
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
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    })
  );
}

export default logger;
