import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const corsOptions = {
    origin: [
        'https://fueldeliveryapp-1.onrender.com',
        'http://localhost:3001',
        process.env.CORS_ORIGIN
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 hours
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
