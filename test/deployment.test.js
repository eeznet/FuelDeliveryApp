import request from 'supertest';
import { app } from '../server.mjs';
import pool from '../config/database.mjs';

describe('Deployment Tests', () => {
    test('Health Check Endpoint', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('Database Connections', async () => {
        const res = await request(app).get('/api/health');
        expect(res.body.databases.postgres).toBe('connected');
        expect(res.body.databases.mongodb).toBe('connected');
    });

    test('Environment Variables', () => {
        expect(process.env.NODE_ENV).toBe('production');
        expect(process.env.MONGO_URI).toBeDefined();
        expect(process.env.DB_HOST).toBeDefined();
        expect(process.env.JWT_SECRET).toBeDefined();
    });

    describe('Authentication Tests', () => {
        test('Owner Login', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'eeznetsolutions@gmail.com',
                    password: 'owner123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.role).toBe('owner');
        });

        test('Admin Login', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'moerayblog@gmail.com',
                    password: 'admin123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.role).toBe('admin');
        });
    });

    describe('Role-based Access', () => {
        let ownerToken;
        let adminToken;

        beforeAll(async () => {
            // Get tokens
            const ownerLogin = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'eeznetsolutions@gmail.com',
                    password: 'owner123'
                });
            ownerToken = ownerLogin.body.token;

            const adminLogin = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@fueldelivery.com',
                    password: 'admin123'
                });
            adminToken = adminLogin.body.token;
        });

        test('Owner Access', async () => {
            const res = await request(app)
                .get('/api/owner/analytics')
                .set('Authorization', `Bearer ${ownerToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test('Admin Access', async () => {
            const res = await request(app)
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Admin User Setup', () => {
        test('Admin User Exists', async () => {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                ['moerayblog@gmail.com']
            );
            expect(result.rows.length).toBe(1);
            expect(result.rows[0].role).toBe('admin');
        });

        test('Admin Login Credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'moerayblog@gmail.com',
                    password: 'admin123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.role).toBe('admin');
            expect(res.body.token).toBeDefined();
        });
    });
}); 