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
import corsMiddleware from './config/corsMiddleware.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(express.static('public'));

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
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databases: {
            postgres: pool.totalCount > 0 ? 'connected' : 'disconnected',
            mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        }
    });
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

export { app, pool };
