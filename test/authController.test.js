import request from 'supertest';
import { app, shutdownServer } from '../server.mjs'; // Add .mjs extension
import { connectDatabases, cleanupDatabases } from './db-setup';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe("Authentication Controller Tests", () => {
    let testUser;
    let validToken;

    beforeAll(async () => {
        await connectDatabases();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        
        // Create test user with raw password
        testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test@123',  // Let model hash it
            role: 'client',
            isActive: true
        });
        
        await testUser.save();  // This triggers password hashing
        
        // Use the model's token generation method
        validToken = testUser.generateToken();
    });

    afterAll(async () => {
        await cleanupDatabases();
        await shutdownServer();
        await mongoose.connection.close();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "New User",
                    email: "newuser@example.com",
                    password: "Test@123",
                    role: "client",
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User registered successfully");
        });

        it("should return 400 if user already exists", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Test User",
                    email: "test@example.com",
                    password: "Test@123",
                    role: "client",
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Email already exists");
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login with valid credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: testUser.email,
                    password: 'Test@123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Login successful");
            expect(res.body).toHaveProperty("token");
        });

        it("should return 401 for invalid credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Invalid credentials");
        });

        it("should return 403 for disabled account", async () => {
            // First disable the account
            await User.findByIdAndUpdate(testUser._id, { isActive: false });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'Test@123'
                });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Account disabled');
        });
    });

    describe("GET /api/user/profile", () => {
        it("should return 401 for invalid token", async () => {
            const res = await request(app)
                .get("/api/user/profile")
                .set("Authorization", "Bearer invalidtoken");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Unauthorized");
        });

        it("should return 401 for expired token", async () => {
            const expiredToken = jwt.sign(
                { userId: testUser._id, email: testUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "1s" }
            );

            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for token to expire

            const res = await request(app)
                .get("/api/user/profile")
                .set("Authorization", `Bearer ${expiredToken}`);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Token has expired");
        });
    });
});
