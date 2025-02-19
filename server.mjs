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

// Basic routes first
app.get('/', (req, res) => {
    logger.info('Root endpoint hit');
    res.json({ 
        message: 'Fuel Delivery API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    logger.info('API root endpoint hit');
    res.json({ 
        message: 'Fuel Delivery API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    logger.info('Health check endpoint hit');
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

app.get('/api/test', (req, res) => {
    logger.info('Test endpoint hit');
    res.json({
        message: 'API is accessible',
        timestamp: new Date().toISOString()
    });
});

// API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use((req, res) => {
    logger.info(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedPath: req.originalUrl
    });
});

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
const PORT = process.env.PORT || 10000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        logger.info(`Server running on port ${PORT}`);
        await connectDB();
    });
}

export default app;
