import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "./logger.js"; // Use Winston for logging

dotenv.config();

// Validate environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_PORT"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
    logger.error(`Missing environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
}

// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432, // Default to 5432 for PostgreSQL
    ssl: { rejectUnauthorized: false }, // Required for Render
});

// Verify database connection
(async () => {
    try {
        const client = await pool.connect();
        logger.info("✅ PostgreSQL Database connected successfully");
        client.release();
    } catch (err) {
        logger.error("❌ PostgreSQL Database connection failed:", err);
        process.exit(1);
    }
})();

export default pool;
