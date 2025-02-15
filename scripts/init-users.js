const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Use production database credentials with full hostname
const pool = new Pool({
    host: 'dpg-cunj0p23esus73ciric0-a.oregon-postgres.render.com',
    user: 'fuel_delivery_user',
    password: 'vcDMwd55ajsFUnZqlPuItAm1k9bIn88N',
    database: 'fuel_delivery_db',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeUsers() {
    const client = await pool.connect();
    try {
        // First, create the users table if it doesn't exist
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

        // Create owner
        const ownerPassword = await bcrypt.hash('owner123', 10);
        await client.query(`
            INSERT INTO users (name, email, password, role, is_active)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
        `, ['System Owner', 'eeznetsolutions@gmail.com', ownerPassword, 'owner', true]);

        // Create admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (name, email, password, role, is_active)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
        `, ['System Admin', 'admin@example.com', adminPassword, 'admin', true]);

        console.log('✅ Owner and admin users created successfully');

        // Verify users were created
        const result = await client.query('SELECT email, role FROM users');
        console.log('Current users:', result.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating users:', error);
        process.exit(1);
    } finally {
        client.release();
    }
}

initializeUsers(); 