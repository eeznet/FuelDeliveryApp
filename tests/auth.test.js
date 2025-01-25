const request = require('supertest');
const app = require('../server'); // Assuming your app is in server.js

describe('POST /auth/login', () => {
    it('should return a 200 for successful login', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password' });
        expect(response.status).toBe(200);
    });
});
