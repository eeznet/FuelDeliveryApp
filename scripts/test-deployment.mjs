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
        const BASE_URL = process.env.NODE_ENV === 'production' 
            ? 'https://fueldeliverywebapp.onrender.com'
            : 'http://localhost:10000';

        console.log('Testing connection to:', BASE_URL);
        
        // Simple ping test first
        try {
            console.log('Pinging server...');
            const pingResponse = await api.get(`${BASE_URL}/api`);
            console.log('Server responded:', pingResponse.status);
        } catch (error) {
            console.error('Ping failed:', error.message);
            if (error.code) console.error('Error code:', error.code);
        }

        // Test root endpoint
        console.log('Testing root endpoint...');
        try {
            const rootResponse = await api.get(`${BASE_URL}/api`);
            console.log('Root response:', rootResponse.status, rootResponse.data);
            if (rootResponse.status !== 200) {
                throw new Error(`Root endpoint returned ${rootResponse.status}`);
            }
        } catch (error) {
            console.error('Root endpoint error:', error.message);
            if (error.response) {
                console.error('Response:', error.response.status, error.response.data);
            }
            throw error;
        }

        // Test health endpoint
        console.log('Testing health endpoint...');
        try {
            const healthResponse = await api.get(`${BASE_URL}/api/health`);
            console.log('Health response:', healthResponse.status, healthResponse.data);
            if (healthResponse.status !== 200) {
                throw new Error(`Health endpoint returned ${healthResponse.status}`);
            }
        } catch (error) {
            console.error('Health endpoint error:', error.message);
            if (error.response) {
                console.error('Response:', error.response.status, error.response.data);
            }
            throw error;
        }

        // Test auth endpoint
        console.log('Testing auth endpoint...');
        try {
            const authResponse = await api.post(`${BASE_URL}/api/auth/login`, {
                email: 'eeznetsolutions@gmail.com',
                password: 'owner123'
            });
            console.log('Auth response:', authResponse.status, authResponse.data);
            if (authResponse.status !== 200) {
                throw new Error(`Auth endpoint returned ${authResponse.status}`);
            }
        } catch (error) {
            console.error('Auth endpoint error:', error.message);
            if (error.response) {
                console.error('Response:', error.response.status, error.response.data);
            }
            throw error;
        }

        console.log('✅ All tests completed successfully');
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