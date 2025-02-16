import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.mjs';
import { promises as fs } from 'fs';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
dotenv.config();

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
    const client = await pool.connect();
    try {
        // Create users table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create admin user if doesn't exist
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, ['Admin User', 'eeznetsolutions@gmail.com', hashedPassword, 'admin']);

        logger.info('✅ Database initialized successfully');
    } catch (error) {
        logger.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Connection events
pool.on('connect', () => {
    logger.info('✅ PostgreSQL connected');
    initializeDatabase().catch(err => {
        logger.error('Failed to initialize database:', err);
    });
});

pool.on('error', (err) => {
    logger.error('❌ PostgreSQL error:', err);
});

export default pool; 