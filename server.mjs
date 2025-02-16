import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import logger from './config/logger.mjs';
import pool from './config/database.mjs';
import authRoutes from './routes/authRoutes.mjs';
import invoiceRoutes from './routes/invoiceRoutes.mjs';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// CORS configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Changed to allow all origins for testing
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Database Connections
const connectDatabases = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('✅ Connected to MongoDB');

        // PostgreSQL connection is handled in database.mjs
        // Wait for both connections
        await Promise.all([
            new Promise((resolve) => {
                pool.on('connect', () => {
                    logger.info('✅ Connected to PostgreSQL');
                    resolve();
                });
            }),
            mongoose.connection.asPromise()
        ]);

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);

// Add a catch-all route for undefined routes
app.use('*', (req, res) => {
    logger.warn('404 - Route not found:', req.originalUrl);
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
