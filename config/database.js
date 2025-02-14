import pkg from "pg";
import dotenv from "dotenv";
import logger from "./logger.js"; // Winston logger

dotenv.config();

const { Pool } = pkg;

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "PORT"];
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
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    max: 10, // Connection pool size
    idleTimeoutMillis: 30000, // 30 seconds idle timeout
});

// Verify database connection
(async () => {
    try {
        const client = await pool.connect();
        logger.info("✅ PostgreSQL Database connected successfully");
        client.release();
    } catch (err) {
        logger.error("❌ PostgreSQL connection failed:", err);
        process.exit(1);
    }
})();

export default pool;
