import cors from "cors";
import logger from "./logger.mjs";

const allowedOrigins = [
  "https://fueldeliveryapp-1.onrender.com", // Frontend
  "https://fueldeliverywebapp.onrender.com", // Backend (if accessed externally)
  "http://localhost:3000", // Local development
  "http://localhost:3001" // Alternative local dev
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
  exposedHeaders: ["Content-Length"],
  maxAge: 86400 // Cache preflight response for 24 hours
};

// ✅ Preflight Handling Middleware
const handlePreflight = (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept");
    return res.status(204).send(); // No content response
  }
  next();
};

export default [cors(corsOptions), handlePreflight]; 
