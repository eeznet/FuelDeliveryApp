import request from 'supertest';
import { app, server } from '../server.mjs';
import pool from '../config/database.mjs';

describe('Invoice Endpoints', () => {
    let authToken;
    let userId;

    beforeAll(async () => {
        // Create test user and get token
        const userData = {
            name: 'Test Client',
            email: 'testclient@example.com',
            password: 'password123',
            role: 'client'
        };

        await request(app)
            .post('/api/auth/register')
            .send(userData);

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        authToken = loginRes.body.token;
        userId = loginRes.body.user.id;
    });

    afterAll(async () => {
        // Clean up test data
        await pool.query('DELETE FROM deliveries WHERE invoice_id IN (SELECT id FROM invoices WHERE client_id = $1)', [userId]);
        await pool.query('DELETE FROM invoices WHERE client_id = $1', [userId]);
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    });

    describe('GET /api/invoice/client', () => {
        it('should get client invoices', async () => {
            const res = await request(app)
                .get('/api/invoice/client')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.invoices)).toBe(true);
        });

        it('should not get invoices without auth', async () => {
            const res = await request(app)
                .get('/api/invoice/client');

            expect(res.statusCode).toBe(401);
        });
    });
}); 