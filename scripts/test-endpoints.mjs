const axios = require('axios');

const API_URL = 'https://fuel-delivery-backend.onrender.com/api';
let adminToken, clientToken, driverToken;

async function testEndpoints() {
    try {
        // 1. Test Admin Login
        console.log('Testing admin login...');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'eeznetsolutions@gmail.com',
            password: 'admin123'
        });
        adminToken = adminLogin.data.token;
        console.log('✅ Admin login successful');

        // 2. Test Client Registration
        console.log('Testing client registration...');
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Client',
            email: 'test.client@example.com',
            password: 'client123',
            role: 'client'
        });
        console.log('✅ Client registration successful');

        // Continue with more tests...
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testEndpoints(); 