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

// Initialize router once
const router = express.Router();

// Health check route under /api/health
router.get('/health', (req, res) => {
    logger.info('✅ Health check endpoint hit');
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Move this before other route definitions
app.get('/api', (req, res) => {
    logger.info('✅ API root endpoint hit');
    res.json({ 
        success: true,
        message: 'Fuel Delivery API is running',
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});

// Apply CORS middleware before routes
app.use(...corsMiddleware);

// Regular middleware
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

// Then mount other routes
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

// Add after all route definitions
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedPath: req.path
    });
});

app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Update the database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'dpg-cunj0p23esus73ciric0-a',
    database: process.env.DB_NAME || 'fuel_delivery_db',
    user: process.env.DB_USER || 'fuel_delivery_user',
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
};

// Update pool configuration
pool.options = dbConfig;

// Update the port configuration
const PORT = process.env.PORT || 3000;

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
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await connectDB();
    });
}

// Add health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check PostgreSQL
        const pgResult = await pool.query('SELECT NOW()');
        
        // Check MongoDB
        const mongoStatus = mongoose.connection.readyState === 1;

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            databases: {
                postgres: pgResult ? 'connected' : 'disconnected',
                mongodb: mongoStatus ? 'connected' : 'disconnected'
            }
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default app;
