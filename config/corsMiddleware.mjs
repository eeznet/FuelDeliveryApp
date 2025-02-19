import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.mjs";

dotenv.config();

const whitelist = [
    'https://fueldeliveryapp-1.onrender.com',
    'http://localhost:3001',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        logger.info('Request origin:', origin);
        
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) {
            return callback(null, true);
        }
        
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            logger.error('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

const corsMiddleware = cors(corsOptions);

// Add OPTIONS handling for preflight requests
const handleOptions = (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.status(204).end();
};

// Export both middleware
export { corsMiddleware, handleOptions };
