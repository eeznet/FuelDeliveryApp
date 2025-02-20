import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const allowedOrigins = [
    'https://fueldeliveryapp-1.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
];

const corsMiddleware = [
    // First middleware to handle CORS preflight
    (req, res, next) => {
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            logger.info('Handling OPTIONS request');
            return res.sendStatus(200);
        }
        next();
    },
    
    // Then the cors package
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
    })
];

export { corsMiddleware };
