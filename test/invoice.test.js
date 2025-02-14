// tests/invoice.test.js
import request from 'supertest';
import { server } from '../server.mjs';
import User from '../models/user.js';
import Invoice from '../models/invoice.js';
import bcrypt from 'bcryptjs';
import { connectDatabases, cleanupDatabases } from './db-setup.js';
import { jest, describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';

describe('Invoice API Tests', () => {
    let testUser, invoice;

    beforeAll(async () => {
        try {
            await connectDatabases();
        } catch (error) {
            console.error('Failed to connect to databases:', error);
            throw error;
        }
    });

    afterAll(async () => {
        await cleanupDatabases();
        if (server.close) {
            await new Promise(resolve => server.close(resolve));
        }
    });

    beforeEach(async () => {
        try {
            const hashedPassword = await bcrypt.hash('Test@123', 10);
            testUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'client',
            });

            invoice = await Invoice.create({
                clientId: testUser._id,
                deliveryAddress: '123 Test Street',
                totalLiters: 100,
                totalPrice: 500,
                status: 'outstanding',
                payments: [],
                createdBy: testUser._id,
                // Add any other required fields
            });
        } catch (error) {
            console.error('Error in test setup:', error);
            throw error;
        }
    });

    afterEach(async () => {
        try {
            if (invoice?._id) {
                await Invoice.deleteOne({ _id: invoice._id });
            }
            if (testUser?._id) {
                await User.deleteOne({ _id: testUser._id });
            }
        } catch (error) {
            console.error('Error in test cleanup:', error);
        }
    });

    it('should process a payment successfully', async () => {
        expect(invoice).toBeDefined();
        expect(invoice._id).toBeDefined();

        const payment = {
            amount: 500,
            method: 'cash'
        };

        const res = await request(server)
            .post(`/api/invoice/${invoice._id}/payment`)
            .send(payment)
            .set('Authorization', `Bearer ${testUser.generateToken()}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Payment processed successfully');

        const updatedInvoice = await Invoice.findById(invoice._id);
        expect(updatedInvoice.status).toBe('paid');
        expect(updatedInvoice.payments).toHaveLength(1);
        expect(updatedInvoice.payments[0].amount).toBe(500);
    });

    // Other tests remain unchanged...
});
