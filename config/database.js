import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "./logger.js"; // Use Winston for logging

dotenv.config();

// Validate environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
    logger.error(`Missing environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
}

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Verify database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        logger.info("Database connected successfully");
        connection.release();
    } catch (err) {
        logger.error("Database connection failed:", err);
        process.exit(1);
    }
})();

export default pool;
