import cors from "cors";

const allowedOrigins = [
    'https://fueldeliveryapp-1.onrender.com',    // Production frontend
    'https://fuel-delivery-app.onrender.com',    // Alternative frontend URL
    'http://localhost:5173',                     // Development frontend
    'http://localhost:3000'                      // Development backend
];

const corsOptions = {
    origin: function(origin, callback) {
        console.log('CORS Request from origin:', origin);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log('CORS blocked for origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Access-Control-Allow-Origin']
};

export default cors(corsOptions);
