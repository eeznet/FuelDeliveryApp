import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

// List of required environment variables
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "MONGO_URI",
  "LOG_LEVEL",
  "JWT_SECRET",
  "PORT"
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error(`Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1); // Exit the app if required env variables are missing
}

logger.info("All required environment variables are set.");
