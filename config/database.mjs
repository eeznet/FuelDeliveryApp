import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.mjs';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://fuel_delivery_user:vcDMwd55ajsFUnZqlPuItAm1k9bIn88N@dpg-cunj0p23esus73ciric0-a.oregon-postgres.render.com/fuel_delivery_db';

// Parse the URL to get components
const parseDbUrl = (url) => {
    try {
        const parsed = new URL(url);
        return {
            user: parsed.username,
            password: parsed.password,
            host: parsed.hostname,
            port: parsed.port,
            database: parsed.pathname.split('/')[1],
            ssl: { rejectUnauthorized: false }
        };
    } catch (error) {
        logger.error('Failed to parse database URL:', error);
        return null;
    }
};

// Create pool with explicit configuration
const pool = new Pool(parseDbUrl(DATABASE_URL) || {
    user: 'fuel_delivery_user',
    password: 'vcDMwd55ajsFUnZqlPuItAm1k9bIn88N',
    host: 'dpg-cunj0p23esus73ciric0-a.oregon-postgres.render.com',
    port: 5432,
    database: 'fuel_delivery_db',
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize database tables
const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        // Create tables
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
                driver_id INTEGER REFERENCES users(id),
                liters_delivered DECIMAL(10,2) NOT NULL,
                price_per_liter DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                address TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS deliveries (
                id SERIAL PRIMARY KEY,
                invoice_id INTEGER REFERENCES invoices(id),
                driver_id INTEGER REFERENCES users(id),
                status VARCHAR(50) DEFAULT 'pending',
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS fuel_prices (
                id SERIAL PRIMARY KEY,
                price_per_liter DECIMAL(10,2) NOT NULL,
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create default admin user if doesn't exist
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

// Test connection with better error logging
export const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT NOW()');
            client.release();
            logger.info('✅ PostgreSQL Connected Successfully');
            return true;
        } catch (error) {
            logger.error(`❌ PostgreSQL Connection Attempt ${i + 1}/${retries} Failed:`, {
                message: error.message,
                code: error.code,
                detail: error.detail
            });
            if (i === retries - 1) return false;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
    return false;
};

// Handle pool errors
pool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL error:', {
        message: err.message,
        code: err.code,
        detail: err.detail
    });
    // Don't exit in production
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

export default pool; 