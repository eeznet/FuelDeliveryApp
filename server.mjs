import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectMongoDB } from "./config/mongoose.js";
import mongoose from "mongoose";
import logger from "./config/logger.js";
import fs from 'fs';
import apiRoutes from './routes/apiRoutes.js';
import corsMiddleware from './config/corsMiddleware.js';
import invoiceRoutes from './routes/invoiceRoutes.js';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
dotenv.config();

// Set environment
const isProduction = process.env.NODE_ENV === "production";
console.log(`Running in ${isProduction ? "production" : "development"} mode`);

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "PORT"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error(`Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Consolidate all CORS configuration in one place at the top of middleware section
app.use((req, res, next) => {
    // Specific allowed origin
    const allowedOrigin = 'https://fueldeliveryapp-1.onrender.com';
    
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Log request for debugging
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    
    next();
});

// Add this after CORS middleware and before other routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        cors: {
            origin: req.headers.origin,
            method: req.method
        }
    });
});

// PostgreSQL Connection Pool (uses DB_PORT if defined, otherwise defaults to 5432)
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Test PostgreSQL Connection
const connectPostgres = async () => {
  try {
    const client = await pool.connect();
    logger.info("✅ PostgreSQL Database connected successfully");
    client.release();
    return true;
  } catch (err) {
    logger.error("❌ PostgreSQL connection failed:", err);
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    throw err;
  }
};

// Add this before loadRoutes to debug
console.log("Controllers directory:", fs.readdirSync(path.resolve(__dirname, './controllers')));

// Dynamic imports for routes
const loadRoutes = async () => {
  try {
    // List files in the routes directory for debugging
    console.log(fs.readdirSync(path.resolve(__dirname, './routes')));

    const authRoutes = (await import(path.resolve(__dirname, './routes/authroutes.js'))).default;
    const userRoutes = (await import(path.resolve(__dirname, './routes/userRoutes.js'))).default;
    const invoiceRoutes = (await import(path.resolve(__dirname, './routes/invoiceRoutes.js'))).default;

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/invoice", invoiceRoutes);

    console.log("✅ Routes loaded successfully");
  } catch (error) {
    console.error("❌ Error loading routes:", error);
    console.error("Error details:", error.code, error.message);
    throw error;
  }
};

// Add this after other route middleware
app.use('/api', apiRoutes);
app.use('/api/invoice', invoiceRoutes);

// Add error logging middleware
app.use((err, req, res, next) => {
    console.error('Error:', {
        path: req.path,
        method: req.method,
        error: err.message
    });
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Initialize app
const initializeApp = async () => {
  try {
    // Connect to MongoDB first
    await connectMongoDB();
    console.log("✅ MongoDB connected");

    // Try PostgreSQL connection with retries
    let pgSuccess = false;
    const maxRetries = 5;
    let retryCount = 0;

    while (!pgSuccess && retryCount < maxRetries) {
      try {
        pgSuccess = await connectPostgres();
        if (!pgSuccess) {
          retryCount++;
          console.log(`PostgreSQL connection attempt ${retryCount} of ${maxRetries} failed`);
          if (retryCount < maxRetries) {
            console.log("Waiting 5 seconds before retry...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      } catch (error) {
        retryCount++;
        console.error(`PostgreSQL connection attempt ${retryCount} failed:`, error.message);
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }

    // Load routes
    await loadRoutes();

    // Default Root Route
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Add this after the root route
    app.get("/dashboard", (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    });

    // Start server
    const PORT = process.env.NODE_ENV === "test" ? 0 : (process.env.PORT || 3000);
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${server.address().port}`);
      console.log(`✅ App initialized successfully in ${process.env.NODE_ENV} mode`);
    });

    return server;
  } catch (error) {
    console.error("❌ Error initializing app:", error.message);
    if (process.env.NODE_ENV === "production") {
      const PORT = process.env.PORT || 3000;
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${server.address().port} (with errors)`);
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
        await pool.end();
        console.log("✅ PostgreSQL Pool Ended");
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

export { app, server, shutdownServer, pool };
