import cors from "cors";

const corsOptions = {
    origin: 'https://fueldeliveryapp-1.onrender.com', // Single origin for now
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Create middleware
const corsMiddleware = cors(corsOptions);

// Add preflight handler
const handleCORS = (req, res, next) => {
    // Log CORS details
    console.log('CORS Request:', {
        origin: req.headers.origin,
        method: req.method,
        path: req.path
    });

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', 'https://fueldeliveryapp-1.onrender.com');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.status(204).send();
    }

    corsMiddleware(req, res, next);
};

export default handleCORS;
