import dotenv from "dotenv";

dotenv.config();

const appConfig = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  logLevel: process.env.LOG_LEVEL || "info",
  environment: process.env.NODE_ENV || "development",
};

export default appConfig;
