import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.js';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import fsPromises from 'fs/promises';

dotenv.config();

const { Pool } = pg;

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "PORT"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
    logger.error(`Missing environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
}

// Create PostgreSQL pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize database tables
const initializeDatabase = async () => {
    try {
        const client = await pool.connect();
        
        // Read and execute schema.sql
        const schema = await fs.readFile('./database/schema.sql', 'utf8');
        await client.query(schema);
        
        // Create default owner if doesn't exist
        const ownerExists = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [process.env.ADMIN_EMAIL]
        );
        
        if (ownerExists.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await client.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                ['System Owner', process.env.ADMIN_EMAIL, hashedPassword, 'owner']
            );
            logger.info('Default owner account created');
        }

        // Set initial fuel price if none exists
        const priceExists = await client.query('SELECT * FROM fuel_prices LIMIT 1');
        if (priceExists.rows.length === 0) {
            await client.query(
                'INSERT INTO fuel_prices (price_per_liter, created_by) VALUES ($1, $2)',
                [2.50, 1] // Default price of $2.50 per liter
            );
            logger.info('Initial fuel price set');
        }

        client.release();
        logger.info('✅ Database initialized successfully');
    } catch (error) {
        logger.error('❌ Database initialization failed:', error);
        throw error;
    }
};

// Test database connection
pool.on('connect', () => {
    logger.info('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
    logger.error('❌ PostgreSQL error:', err);
});

// Initialize database on startup
initializeDatabase().catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
});

export default pool;
