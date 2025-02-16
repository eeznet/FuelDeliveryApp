import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';

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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

// Database connection
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000,
    query_timeout: 10000
});

// Test database connection
pool.connect()
    .then(client => {
        console.log('✅ Connected to PostgreSQL database');
        client.release();
    })
    .catch(err => {
        console.error('❌ Database connection error:', err.message);
    });

// Health check endpoint - update to include MongoDB status
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
    console.log('404 - Route not found:', req.originalUrl);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedPath: req.originalUrl
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app, pool };
