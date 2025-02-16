import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
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
        `);

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, ['Admin User', 'eeznetsolutions@gmail.com', hashedPassword, 'admin']);

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    } finally {
        client.release();
    }
}

initializeDatabase(); 