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

// Add before routes
if (DEBUG) {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}

// API Routes - must be before static files
app.get('/api', (req, res) => {
    console.log('API endpoint hit');
    res.json({ 
        success: true,
        message: 'Fuel Delivery API is running',
        environment: process.env.NODE_ENV
    });
});

app.get('/api/health', (req, res) => {
    console.log('Health endpoint hit');
    res.json({
        success: true,
        status: 'ok',
        environment: process.env.NODE_ENV
    });
});

// API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/user', userRoutes);

// Static files and SPA routing - must be after API routes
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    console.log(`404 - ${req.method} ${req.url}`);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({
            success: false,
            message: 'Route not found',
            requestedPath: req.originalUrl
        });
    }
});

// Add after route registration
if (DEBUG) {
    console.log('Registered routes:');
    app._router.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
        }
    });
}

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
        logger.info(`Server running on port ${PORT}`);
        await connectDB();
    });
}

export default app;
