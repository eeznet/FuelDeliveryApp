import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import logger from './config/logger.mjs';
import pool from './config/database.mjs';
import authRoutes from './routes/authRoutes.mjs';
import invoiceRoutes from './routes/invoiceRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
let server;

// Update CORS Configuration
const corsOptions = {
    origin: [
        'https://fueldeliveryapp-1.onrender.com',
        'https://fuel-delivery-backend.onrender.com',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Make sure this is before any routes
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));

// Add CORS headers to all responses
app.use((req, res, next) => {
    // Set the specific origin instead of *
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
    logger.info('Incoming request:', {
        method: req.method,
        url: req.url,
        path: req.path,
        headers: req.headers
    });
    next();
});

// Add security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Database Connections
const connectDatabases = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('✅ Connected to MongoDB');

        // Test PostgreSQL connection
        const client = await pool.connect();
        logger.info('✅ Connected to PostgreSQL');
        client.release();

        logger.info('✅ All database connections established');
    } catch (error) {
        logger.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

// Initialize databases
connectDatabases();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Add a root endpoint for basic connectivity test
app.get('/', (req, res) => {
    res.json({ message: 'Fuel Delivery API is running' });
});

// Routes with logging
logger.info('Setting up routes...');

// Mount routes directly
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/user', userRoutes);

// Add route debugging
app.use((req, res, next) => {
    logger.info('Route not matched:', {
        method: req.method,
        url: req.url,
        availableRoutes: app._router.stack
            .filter(r => r.route)
            .map(r => ({
                path: r.route.path,
                methods: Object.keys(r.route.methods)
            }))
    });
    next();
});

// Debug middleware to catch unmatched routes
app.use('*', (req, res) => {
    logger.warn('404 - Route not found:', {
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        baseUrl: req.baseUrl,
        routes: app._router.stack
            .filter(r => r.route || r.handle)
            .map(r => ({
                path: r.route?.path || r.regexp,
                methods: r.route ? Object.keys(r.route.methods) : 'middleware'
            }))
    });
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedPath: req.originalUrl
    });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

export { app, pool, server };
