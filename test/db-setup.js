import mongoose from 'mongoose';
import mysql from 'mysql2/promise';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Invoice from '../models/invoice.js';
import bcrypt from 'bcryptjs';

dotenv.config();

let mongoServer;
let mysqlConnection;

async function createTestDatabase() {
    // Connect to MySQL without database selected
    const connection = await mysql.createConnection({
        host: process.env.TEST_DB_HOST || 'localhost',
        user: process.env.TEST_DB_USER || 'root',
        password: process.env.TEST_DB_PASSWORD || ''
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.TEST_DB_NAME || 'test_fuel_delivery_db'}`);
        console.log('✅ Test database created or already exists');
    } catch (err) {
        console.error('❌ Error creating test database:', err);
        throw err;
    } finally {
        await connection.end();
    }
}

// MongoDB & MySQL Connection Setup
export const connectDatabases = async () => {
    try {
        // Create test database first
        await createTestDatabase();

        // Setup MongoDB Memory Server
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        // Close any existing connection
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB test database connected');

        // Setup MySQL test connection
        mysqlConnection = await mysql.createConnection({
            host: process.env.TEST_DB_HOST || 'localhost',
            user: process.env.TEST_DB_USER || 'root',
            password: process.env.TEST_DB_PASSWORD || '',
            database: process.env.TEST_DB_NAME || 'test_fuel_delivery_db'
        });
        console.log('✅ MySQL test database connected');

        // Create necessary tables
        await setupTestTables(mysqlConnection);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        throw err;
    }
};

async function setupTestTables(connection) {
    try {
        // Create your test tables here
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('owner', 'driver', 'client', 'admin') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add more table creation queries as needed

        console.log('✅ Test tables created successfully');
    } catch (err) {
        console.error('❌ Error creating test tables:', err);
        throw err;
    }
}

// Cleanup databases after tests
export const cleanupDatabases = async () => {
    try {
        // Close MySQL connection
        if (mysqlConnection) {
            await mysqlConnection.query(`DROP TABLE IF EXISTS users`);
            await mysqlConnection.end();
            mysqlConnection = null;
            console.log('✅ MySQL connection closed and test data cleaned');
        }

        // Close MongoDB connection and stop memory server
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
            console.log('✅ MongoDB connection closed and test data cleaned');
        }
    } catch (err) {
        console.error('❌ Error in database cleanup:', err);
        throw err;
    }
};

// Create test user
export const createTestUser = async (isActive = true) => {
    const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('Test@123', 10),
        role: 'client',
        isActive: isActive
    });

    await testUser.save();
    return testUser;
};

// Setup test data
export const setupTestData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Invoice.deleteMany({});

        // Create test user
        const testUser = await createTestUser();

        // Create test invoice
        const invoice = new Invoice({
            clientId: testUser._id,
            amount: 100,
            dueDate: new Date(),
            status: 'pending'
        });

        await invoice.save();

        return { testUser, invoice };
    } catch (error) {
        console.error('Error setting up test data:', error);
        throw error;
    }
};

// Clean up test data
export const cleanupTestData = async () => {
    await User.deleteMany({});
    await Invoice.deleteMany({});
};
