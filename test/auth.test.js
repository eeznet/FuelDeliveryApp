// tests/auth.test.js
import request from 'supertest';
import { app, shutdownServer } from '../server.mjs';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabases, cleanupDatabases } from './db-setup'; // Import DB setup/cleanup
import jwt from 'jsonwebtoken'; // For token expiry test
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Helper function to make login requests
const loginUser = async (email, password) => {
    return await request(app)
        .post('/api/auth/login')
        .send({ email, password })
        .set('Accept', 'application/json');  // Add content type header
};

describe('Authentication API Tests', () => {
    let testUser;
    let validToken;

    beforeAll(async () => {
        try {
            await connectDatabases();
        } catch (error) {
            console.error('Test setup failed:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        await User.deleteMany({});
        
        // Create test user with raw password
        testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test@123',  // Let the model hash it
            role: 'client',
            isActive: true
        });
        
        await testUser.save();  // This will trigger the pre-save hook to hash the password
        validToken = testUser.generateToken();
    });

    afterAll(async () => {
        await cleanupDatabases();
        await shutdownServer();
    });

    it('should return 200 for successful login', async () => {
        const response = await loginUser(testUser.email, 'Test@123');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Login successful');
    });

    it('should return 400 for missing email', async () => {
        const response = await request(app).post('/api/auth/login').send({ password: 'Test@123' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Email is required');
    });

    it('should return 400 for missing password', async () => {
        const response = await request(app).post('/api/auth/login').send({ email: 'test@example.com' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Password is required');
    });

    it('should return 404 for invalid email', async () => {
        const response = await loginUser('invalid@example.com', 'Test@123');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 401 for incorrect password', async () => {
        const response = await loginUser(testUser.email, 'WrongPassword');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 403 for disabled account', async () => {
        // First disable the account
        await User.findByIdAndUpdate(testUser._id, { isActive: false });

        const response = await loginUser(testUser.email, 'Test@123');

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Account disabled');
    });

    it('should return 401 for invalid token', async () => {
        const response = await request(app)
            .get('/api/user/profile')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for expired token', async () => {
        const expiredToken = jwt.sign(
            { userId: testUser._id, email: testUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1s' }
        );

        // Ensure token expires
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Token has expired');
    });

    it('should return 200 for valid token on protected route', async () => {
        const response = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Profile fetched successfully');
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'Test@123',
                role: 'client' // Use valid role
            });

        expect(response.status).toBe(201);
        // ... rest of the test
    });
});
