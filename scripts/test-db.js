import pool from '../config/database.js';
import logger from '../config/logger.js';

async function testConnection() {
    try {
        const client = await pool.connect();
        logger.info('Database connection successful');
        
        // Test queries
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        logger.info(`Total users: ${userCount.rows[0].count}`);
        
        const invoiceCount = await client.query('SELECT COUNT(*) FROM invoices');
        logger.info(`Total invoices: ${invoiceCount.rows[0].count}`);
        
        const currentPrice = await client.query('SELECT price_per_liter FROM fuel_prices ORDER BY created_at DESC LIMIT 1');
        logger.info(`Current fuel price: $${currentPrice.rows[0]?.price_per_liter || 'Not set'}`);
        
        client.release();
        process.exit(0);
    } catch (error) {
        logger.error('Database test failed:', error);
        process.exit(1);
    }
}

testConnection(); 