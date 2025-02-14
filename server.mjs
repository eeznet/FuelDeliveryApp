import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise"; // MySQL with Promises
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectMongoDB } from './config/mongoose.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", 
    "MONGO_URI", "PORT", "JWT_SECRET"
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Missing environment variable: ${envVar}`);
        process.exit(1);
    }
});

const app = express();

// Middleware
app.use(bodyParser.json());  

// MySQL Connection Pool
let mysqlConnection;
const connectMysql = async () => {
    try {
        mysqlConnection = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
        });
        console.log("✅ MySQL Connected");
    } catch (err) {
        console.error("❌ MySQL Connection Error:", err.message);
        process.exit(1);
    }
};

// Test MySQL Connection on Startup
(async () => {
    await connectMysql();
    try {
        await mysqlConnection.query("SELECT 1");
        console.log("✅ MySQL is active");
    } catch (err) {
        console.error("❌ MySQL Test Query Failed:", err.message);
        process.exit(1);
    }
})();

// Dynamic imports for routes
const loadRoutes = async () => {
    try {
        const authRoutes = (await import('./routes/authRoutes.js')).default;
        const userRoutes = (await import('./routes/userRoutes.js')).default;
        const invoiceRoutes = (await import('./routes/invoiceRoutes.js')).default;

        // Apply routes
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
        // Connect to databases if not in test environment
        if (process.env.NODE_ENV !== 'test') {
            await connectMysql();
            await connectMongoDB();
            console.log('✅ All database connections established');
        }

        // Load routes
        await loadRoutes();

        // Default Root Route
        app.get("/", (req, res) => {
            res.send("Welcome to the Fuel Delivery App!");
        });

        // Start server
        const PORT = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 3000);
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${server.address().port}`);
        });

        return server;
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        process.exit(1);
    }
};

// Initialize the app
const server = await initializeApp();

// Graceful Shutdown
const shutdownServer = async () => {
    console.log("🛑 Shutting down server...");
    return new Promise((resolve) => {
        server.close(async () => {
            console.log("✅ Server closed");
            try {
                if (mysqlConnection) {
                    await mysqlConnection.end();
                    console.log("✅ MySQL Connection Closed");
                }
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
