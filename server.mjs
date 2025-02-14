import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise"; // MySQL with Promises
import bodyParser from "body-parser";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userroutes.js";
import { connectMongoDB, disconnectMongoDB } from './config/mongoose.js';
import mongoose from 'mongoose'; // Add this import at the top
import invoiceRoutes from './routes/invoiceRoutes.js';

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

// Only connect to databases if not in test environment
if (process.env.NODE_ENV !== 'test') {
    try {
        await connectMysql();
        await connectMongoDB();
        console.log('✅ All database connections established');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/invoice", invoiceRoutes);

// Default Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Fuel Delivery App!");
});

// Test MySQL Connection Route
app.get("/test-mysql", async (req, res) => {
    try {
        const [results] = await mysqlConnection.query("SELECT * FROM users LIMIT 1");
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "MySQL error", error: err.message });
    }
});

// Start Server
const PORT = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 3000);
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${server.address().port}`);
});

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
