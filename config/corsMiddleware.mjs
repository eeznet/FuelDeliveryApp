import cors from 'cors';

const corsOptions = {
    origin: 'https://fueldeliveryapp-1.onrender.com', // Single frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Add logging
const corsMiddleware = cors(corsOptions);

// Wrap with logging
const corsWithLogging = (req, res, next) => {
    console.log('CORS Request:', {
        origin: req.headers.origin,
        method: req.method
    });
    
    corsMiddleware(req, res, (err) => {
        if (err) {
            console.error('CORS Error:', err);
            return res.status(500).json({ error: 'CORS Error' });
        }
        next();
    });
};

export default corsWithLogging;
