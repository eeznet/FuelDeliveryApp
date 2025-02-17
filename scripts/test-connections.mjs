import pkg from 'pg';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

async function testConnections() {
    // Test PostgreSQL
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Test PostgreSQL
        const pgClient = await pool.connect();
        console.log('✅ PostgreSQL connected');
        const pgResult = await pgClient.query('SELECT NOW()');
        console.log('PostgreSQL time:', pgResult.rows[0].now);
        pgClient.release();

        // Test MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        
        // Close connections
        await pool.end();
        await mongoose.connection.close();
        
        console.log('✅ All database connections successful');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        process.exit(1);
    }
}

console.log('🚀 Testing database connections...');
testConnections(); 