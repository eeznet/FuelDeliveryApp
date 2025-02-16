import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.mjs';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

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
        // Create users table
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

            CREATE TABLE IF NOT EXISTS invoices (
                id SERIAL PRIMARY KEY,
                client_id INTEGER REFERENCES users(id),
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create default admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, ['Admin User', 'eeznetsolutions@gmail.com', hashedPassword, 'admin']);

        logger.info('✅ Database tables initialized successfully');
    } catch (error) {
        logger.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Connection events
pool.on('connect', async () => {
    try {
        await initializeDatabase();
    } catch (error) {
        logger.error('Failed to initialize database:', error);
    }
});

pool.on('error', (err) => {
    logger.error('❌ PostgreSQL error:', err);
});

export default pool; 