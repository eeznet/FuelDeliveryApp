import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const corsOptions = {
    origin: [
        'https://fueldeliveryapp-1.onrender.com',
        'https://fuel-delivery-backend.onrender.com',
        'http://localhost:3001',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
