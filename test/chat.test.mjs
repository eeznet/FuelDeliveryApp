import request from 'supertest';
import { app, server } from '../server.mjs';
import Chat from '../models/chat.js';
import { createTestUser, loginTestUser } from './test-utils.mjs';

describe('Chat API Endpoints', () => {
    let ownerToken, clientToken;
    let ownerId, clientId;

    beforeAll(async () => {
        // Create test users
        ownerId = await createTestUser({
            name: 'Test Owner',
            email: 'testowner@test.com',
            password: 'password123',
            role: 'owner'
        });

        clientId = await createTestUser({
            name: 'Test Client',
            email: 'testclient@test.com',
            password: 'password123',
            role: 'client'
        });

        // Login users
        ownerToken = await loginTestUser('testowner@test.com', 'password123');
        clientToken = await loginTestUser('testclient@test.com', 'password123');
    });

    beforeEach(async () => {
        await Chat.deleteMany({});
    });

    describe('GET /api/chat/contacts', () => {
        it('should return list of contacts for client', async () => {
            const res = await request(app)
                .get('/api/chat/contacts')
                .set('Authorization', `Bearer ${clientToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('role');
            expect(['owner', 'supervisor', 'finance']).toContain(res.body[0].role);
        });
    });

    describe('POST /api/chat/send', () => {
        it('should send a message successfully', async () => {
            const messageData = {
                recipientId: ownerId,
                content: 'Test message'
            };

            const res = await request(app)
                .post('/api/chat/send')
                .set('Authorization', `Bearer ${clientToken}`)
                .send(messageData);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('content', 'Test message');
            expect(res.body).toHaveProperty('isSender', true);
        });
    });

    describe('GET /api/chat/history/:contactId', () => {
        it('should get chat history between users', async () => {
            // First send a message
            await request(app)
                .post('/api/chat/send')
                .set('Authorization', `Bearer ${clientToken}`)
                .send({
                    recipientId: ownerId,
                    content: 'Test message'
                });

            const res = await request(app)
                .get(`/api/chat/history/${ownerId}`)
                .set('Authorization', `Bearer ${clientToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('content', 'Test message');
        });
    });

    describe('PUT /api/chat/mark-read/:contactId', () => {
        it('should mark messages as read', async () => {
            // Send a message first
            await request(app)
                .post('/api/chat/send')
                .set('Authorization', `Bearer ${clientToken}`)
                .send({
                    recipientId: ownerId,
                    content: 'Test message'
                });

            const res = await request(app)
                .put(`/api/chat/mark-read/${clientId}`)
                .set('Authorization', `Bearer ${ownerToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);

            // Verify messages are marked as read
            const chat = await Chat.findOne({
                participants: { $all: [ownerId, clientId] }
            });
            expect(chat.messages[0].read).toBe(true);
        });
    });
}); 