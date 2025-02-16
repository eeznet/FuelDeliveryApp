import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.mjs';

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

pool.on('connect', () => {
    logger.info('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
    logger.error('❌ PostgreSQL error:', err);
});

export default pool; 