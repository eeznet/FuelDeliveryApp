import axios from 'axios';
import logger from '../config/logger.mjs';

const testEndpoint = 'https://fuel-delivery-backend.onrender.com/api/auth/login';
const testOrigin = 'https://fueldeliveryapp-1.onrender.com';

async function testCORS() {
    try {
        // Test OPTIONS (preflight)
        logger.info('Testing OPTIONS request...');
        const options = await axios({
            method: 'OPTIONS',
            url: testEndpoint,
            headers: {
                'Origin': testOrigin,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
        });
        logger.info('✅ OPTIONS success:', options.headers);

        // Test actual request
        logger.info('Testing POST request...');
        const login = await axios({
            method: 'POST',
            url: testEndpoint,
            headers: {
                'Origin': testOrigin,
                'Content-Type': 'application/json'
            },
            data: {
                email: 'test@example.com',
                password: 'password123'
            }
        });
        logger.info('✅ POST success:', login.data);

    } catch (error) {
        logger.error('❌ Test failed:', {
            message: error.message,
            response: error.response?.data,
            headers: error.response?.headers
        });
    }
}

testCORS(); 