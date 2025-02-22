import cors from "cors";
import logger from "./logger.mjs";

const allowedOrigins = [
  "https://fueldeliveryapp-1.onrender.com", // ✅ Frontend URL
  "https://fueldeliverywebapp.onrender.com", // ✅ Backend (if accessed externally)
  "http://localhost:3000", // ✅ Local development
  "http://localhost:3001", // ✅ Local development (if using multiple ports)
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
  maxAge: 86400, // Cache preflight response for 24 hours
};

// ✅ Middleware to handle OPTIONS preflight requests
const handlePreflight = (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(204).send(); // No content response
  }
  next();
};

export default [cors(corsOptions), handlePreflight];
