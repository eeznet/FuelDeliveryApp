import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import logger from './config/logger.mjs';
import { default as pool, testConnection } from './config/database.mjs';
import authRoutes from './routes/authRoutes.mjs';
import invoiceRoutes from './routes/invoiceRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import cors from "cors";
import connectMongoDB from './config/mongoose.mjs';
import corsMiddleware from './config/corsMiddleware.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Initialize router once
const router = express.Router();

// Health check route - remove /api prefix since it's added by mounting
router.get('/health', (req, res) => {
    logger.info('✅ Health check endpoint hit');
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api', router);

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

// Update route logging
console.log('=== REGISTERED ROUTES ===');
function logRoutes(stack, prefix = '') {
    stack.forEach((middleware) => {
        if (middleware.route) {
            const methods = Object.keys(middleware.route.methods);
            const path = middleware.route.path;
            console.log(`${methods} ${prefix}${path}`);
        } else if (middleware.name === 'router') {
            const newPrefix = prefix + middleware.regexp.toString()
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\\\//)[1]
                .replace(/\\\//g, '/');
            logRoutes(middleware.handle.stack, newPrefix);
        }
    });
}
logRoutes(app._router.stack);
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

// Update the MongoDB connection configuration
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://eeznetsolutions:Yp3mmebgxnQHA6XG@fueldelapp.iaiqh.mongodb.net/fuelDeliveryApp?retryWrites=true&w=majority';

// Database connection
const connectDB = async () => {
    try {
        // Connect to MongoDB
        await connectMongoDB();
        
        // Test PostgreSQL connection
        const pgConnected = await testConnection();
        if (!pgConnected) {
            throw new Error('PostgreSQL connection failed');
        }
        
        logger.info('✅ All database connections established');
    } catch (error) {
        logger.error('❌ Database connection error:', error);
        // Don't exit process on error in production
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
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

// Apply CORS first, before any routes
app.use(corsMiddleware);

// Regular middleware
app.use(express.json());
app.use(bodyParser.json());

export default app;
