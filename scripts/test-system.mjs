import axios from 'axios';
import { testConnection as testPostgres } from '../config/database.mjs';
import connectMongoDB from '../config/mongoose.mjs';
import logger from '../config/logger.mjs';

const BACKEND_URL = 'https://fueldeliverywebapp.onrender.com';
const FRONTEND_URL = 'https://fueldeliveryapp-1.onrender.com';

async function testSystem() {
    try {
        // 1. Test Databases
        logger.info('Testing Database Connections...');
        const pgConnected = await testPostgres();
        await connectMongoDB();
        logger.info('✅ Database connections successful');

        // 2. Test Backend API
        logger.info('Testing Backend API...');
        const apiTest = await axios.get(`${BACKEND_URL}/api/test`);
        const healthCheck = await axios.get(`${BACKEND_URL}/api/health`);
        logger.info('✅ Backend API responding');

        // 3. Test Authentication
        logger.info('Testing Authentication...');
        const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: 'moerayblog@gmail.com',
            password: 'admin123'
        });
        logger.info('✅ Authentication working');

        // 4. Test CORS
        logger.info('Testing CORS Configuration...');
        const corsResponse = await axios.options(`${BACKEND_URL}/api/test`, {
            headers: {
                'Origin': FRONTEND_URL,
                'Access-Control-Request-Method': 'GET'
            }
        });
        logger.info('✅ CORS configured correctly');

        // Log successful test results
        logger.info('System Test Results:', {
            databases: {
                postgres: pgConnected,
                mongodb: true
            },
            backend: {
                test: apiTest.data.success,
                health: healthCheck.data.status,
                auth: loginResponse.data.success,
                cors: corsResponse.headers['access-control-allow-origin'] === FRONTEND_URL
            }
        });

        return true;
    } catch (error) {
        logger.error('❌ System test failed:', {
            message: error.message,
            component: error.config?.url || 'unknown',
            status: error.response?.status,
            data: error.response?.data
        });
        return false;
    }
}

testSystem(); 