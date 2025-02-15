import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function createAdminAndOwner() {
    const client = await pool.connect();
    try {
        // Create owner
        const hashedOwnerPassword = await bcrypt.hash('owner123', 10);
        await client.query(
            'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
            ['System Owner', 'owner@example.com', hashedOwnerPassword, 'owner', true]
        );

        // Create admin
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        await client.query(
            'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
            ['System Admin', 'admin@example.com', hashedAdminPassword, 'admin', true]
        );

        console.log('Admin and owner users created successfully');
    } catch (error) {
        console.error('Error creating admin and owner:', error);
    } finally {
        client.release();
    }
}

createAdminAndOwner(); 