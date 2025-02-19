import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const corsMiddleware = [
    // First middleware to handle CORS preflight
    (req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'https://fueldeliverywebapp.onrender.com');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.header('Access-Control-Allow-Credentials', 'false');

        // Handle preflight
        if (req.method === 'OPTIONS') {
            logger.info('Handling OPTIONS request');
            return res.sendStatus(200);
        }
        next();
    },
    
    // Then the cors package
    cors({
        origin: 'https://fueldeliverywebapp.onrender.com',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: false
    })
];

export { corsMiddleware };
