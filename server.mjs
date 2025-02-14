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

// Dynamic imports for routes
const loadRoutes = async () => {
  try {
    // List files in the routes directory for debugging
    console.log(fs.readdirSync(path.resolve(__dirname, './routes')));

    const authRoutes = (await import(path.resolve(__dirname, './routes/authRoutes.js'))).default;
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
      res.json({
        message: "Welcome to the Fuel Delivery App!",
        status: "running",
        environment: process.env.NODE_ENV,
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        postgres: pgSuccess ? "connected" : "disconnected",
      });
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
