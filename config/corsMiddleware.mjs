import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const corsOptions = {
    origin: '*', // Temporarily allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
