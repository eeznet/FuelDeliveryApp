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

        // 2. Test Backend API
        logger.info('Testing Backend API...');
        const healthCheck = await axios.get(`${BACKEND_URL}/api/health`);
        
        // 3. Test Authentication
        logger.info('Testing Authentication...');
        const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: 'moerayblog@gmail.com',
            password: 'admin123'
        });

        // 4. Test CORS
        logger.info('Testing CORS Configuration...');
        const corsResponse = await axios.get(`${BACKEND_URL}/api/test`, {
            headers: { 'Origin': FRONTEND_URL }
        });

        logger.info('✅ All systems operational:', {
            databases: {
                postgres: pgConnected ? 'connected' : 'disconnected',
                mongodb: 'connected'
            },
            backend: {
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