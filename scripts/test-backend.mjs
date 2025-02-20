import axios from 'axios';
import logger from '../config/logger.mjs';

const BACKEND_URL = 'https://fueldeliverywebapp.onrender.com';
const FRONTEND_URL = 'https://fueldeliveryapp-1.onrender.com';

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json'
    }
});

async function testBackend() {
    try {
        // Test root endpoint
        console.log('\nTesting root endpoint...');
        const rootResponse = await api.get('/');
        console.log('Root endpoint:', rootResponse.data);

        // Test health endpoint
        console.log('\nTesting health endpoint...');
        const healthResponse = await api.get('/api/health');
        console.log('Health check:', healthResponse.data);

        // Test auth endpoint
        console.log('\nTesting auth endpoint...');
        const loginResponse = await api.post('/api/auth/login', {
            email: 'moerayblog@gmail.com',
            password: 'admin123'
        });
        console.log('Login response:', loginResponse.data);

        console.log('\n✅ All tests passed!');
        return true;
    } catch (error) {
        console.error('\n❌ Test failed:', {
            endpoint: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return false;
    }
}

testBackend();