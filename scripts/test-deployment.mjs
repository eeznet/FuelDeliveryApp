import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../config/logger.mjs';

console.log('Starting test script...');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
console.log('Loading env file:', envFile);
dotenv.config({ path: envFile });

// Configure axios with longer timeout
const api = axios.create({
    timeout: 30000, // Increase to 30 seconds
    validateStatus: false
});

async function testDeployment() {
    try {
        const BASE_URL = 'https://fueldeliverywebapp.onrender.com';
        console.log('Testing API at:', BASE_URL);

        // Test API endpoint
        console.log('Testing /api endpoint...');
        const apiResponse = await api.get(`${BASE_URL}/api`);
        console.log('API Response:', apiResponse.status, apiResponse.data);
        
        if (apiResponse.status !== 200) {
            throw new Error(`API endpoint failed: ${apiResponse.status}`);
        }

        // Test health endpoint
        console.log('Testing health endpoint...');
        const healthResponse = await api.get(`${BASE_URL}/api/health`);
        console.log('Health Response:', healthResponse.status, healthResponse.data);

        if (healthResponse.status !== 200) {
            throw new Error(`Health check failed: ${healthResponse.status}`);
        }

        console.log('✅ All tests passed');
        return true;
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

// Run the test
console.log('Executing test...');
testDeployment()
    .then(success => {
        console.log('Test result:', success ? 'PASSED ✅' : 'FAILED ❌');
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Unexpected error:', error);
        process.exit(1);
    }); 