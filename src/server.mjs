import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectMongoDB } from './config/mongoose.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
dotenv.config();

// Set environment
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

const app = express();

// Middleware
app.use(bodyParser.json());

// MySQL Connection Pool
let mysqlConnection = null;
const connectMysql = async () => {
    try {
        console.log('Attempting MySQL connection...');
        
        // Log connection details (without password)
        console.log('MySQL Config:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        });

        // Create the connection pool
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 5,
            maxIdle: 5,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            timezone: 'Z',
            charset: 'utf8mb4'
        });

        // Test the connection
        mysqlConnection = pool.promise();
        console.log("✅ MySQL Pool Created");

        // Verify connection
        const connection = await mysqlConnection.getConnection();
        console.log("✅ MySQL Connection Acquired");
        
        await connection.query('SELECT 1');
        console.log("✅ MySQL Query Successful");
        
        connection.release();
        console.log("✅ MySQL Connection Released");

        return true;
    } catch (err) {
        console.error("❌ MySQL Connection Error Details:");
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Stack:", err.stack);

        if (process.env.NODE_ENV === 'production') {
            console.log('⚠️ Continuing despite MySQL error in production');
            return false;
        }
        throw err;
    }
};

// Dynamic imports for routes
const loadRoutes = async () => {
    try {
        const authRoutes = (await import('./routes/authRoutes.js')).default;
        const userRoutes = (await import('./routes/userRoutes.js')).default;
        const invoiceRoutes = (await import('./routes/invoiceRoutes.js')).default;

        app.use("/api/auth", authRoutes);
        app.use("/api/user", userRoutes);
        app.use("/api/invoice", invoiceRoutes);

        console.log('✅ Routes loaded successfully');
    } catch (error) {
        console.error('❌ Error loading routes:', error);
        throw error;
    }
};

// Initialize app
const initializeApp = async () => {
    try {
        // Connect to MongoDB first
        await connectMongoDB();
        console.log('✅ MongoDB connected');

        // Try MySQL connection with retries in production
        let mysqlSuccess = false;
        const maxRetries = 5;
        let retryCount = 0;

        while (!mysqlSuccess && retryCount < maxRetries) {
            try {
                mysqlSuccess = await connectMysql();
                if (!mysqlSuccess) {
                    retryCount++;
                    console.log(`MySQL connection attempt ${retryCount} of ${maxRetries} failed`);
                    if (retryCount < maxRetries) {
                        console.log('Waiting 5 seconds before retry...');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
            } catch (error) {
                retryCount++;
                console.error(`MySQL connection attempt ${retryCount} failed:`, error.message);
                if (retryCount < maxRetries) {
                    console.log('Waiting 5 seconds before retry...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        if (!mysqlSuccess && process.env.NODE_ENV !== 'production') {
            throw new Error('Failed to connect to MySQL after multiple attempts');
        }

        // Load routes
        await loadRoutes();

        // Default Root Route with connection status
        app.get("/", (req, res) => {
            res.json({
                message: "Welcome to the Fuel Delivery App!",
                status: "running",
                environment: process.env.NODE_ENV,
                mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
                mysql: mysqlConnection ? "connected" : "disconnected",
                mysqlHost: process.env.DB_HOST
            });
        });

        // Start server
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`✅ App initialized successfully in ${process.env.NODE_ENV} mode`);
        });

        return server;
    } catch (error) {
        console.error('❌ Error initializing app:', error.message);
        if (process.env.NODE_ENV === 'production') {
            console.log('⚠️ Starting server despite initialization error in production');
            const PORT = process.env.PORT || 3000;
            const server = app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT} (with errors)`);
            });
            return server;
        }
        process.exit(1);
    }
};

// Start the app
const server = await initializeApp();

// Graceful Shutdown
const shutdownServer = async () => {
    console.log("🛑 Shutting down server...");
    return new Promise((resolve) => {
        server.close(async () => {
            console.log("✅ Server closed");
            try {
                if (mongoose.connection.readyState) {
                    await mongoose.connection.close();
                    console.log("✅ MongoDB Connection Closed");
                }
            } catch (err) {
                console.error("❌ Error during shutdown:", err.message);
            }
            resolve();
        });
    });
};

process.on("SIGINT", shutdownServer);
process.on("SIGTERM", shutdownServer);

export { app, server, shutdownServer }; 