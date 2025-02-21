import cors from "cors";
import logger from "./logger.mjs";

const allowedOrigins = [
  "https://fueldeliveryapp-1.onrender.com", // Frontend URL
  "https://fueldeliverywebapp.onrender.com", // Backend (if accessed externally)
  "http://localhost:3000", // Local development
  "http://localhost:3001", // Local development (if using multiple ports)
];

const corsOptions = {
  origin: (origin, callback) => {
    logger.info(`CORS Request from origin: ${origin}`);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.error(`❌ CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
  maxAge: 86400, // Cache preflight response for 24 hours
};

export default cors(corsOptions);
