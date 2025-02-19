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
import { corsMiddleware } from './config/corsMiddleware.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS must be first
app.use(corsMiddleware);

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Add at the top after imports
const DEBUG = true;

// Debug logging
if (DEBUG) {
    app.use((req, res, next) => {
        console.log('--------------------');
        console.log(`REQUEST: ${req.method} ${req.url}`);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        next();
    });
}

// Register routes BEFORE static files and catch-all
const router = express.Router();

router.get('/', (req, res) => {
    console.log('✅ API root endpoint hit');
    res.json({ 
        success: true,
        message: 'Fuel Delivery API is running',
        environment: process.env.NODE_ENV
    });
});

router.get('/health', (req, res) => {
    console.log('✅ Health endpoint hit');
    res.json({
        success: true,
        status: 'ok',
        environment: process.env.NODE_ENV
    });
});

// Mount all routes under /api
app.use('/api', router);
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/user', userRoutes);

// Static files after API routes
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route
app.get('*', (req, res) => {
    console.log(`404 - ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedPath: req.originalUrl
    });
});

// Print registered routes on startup
console.log('=== REGISTERED ROUTES ===');
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
            }
        });
    }
});
console.log('========================');

// Error handler
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('✅ MongoDB connected');
        
        const client = await pool.connect();
        logger.info('✅ PostgreSQL connected');
        client.release();
        
        logger.info('✅ All database connections established');
    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await connectDB();
    });
}

export default app;
