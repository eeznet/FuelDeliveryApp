import axios from 'axios';

const testConnection = async () => {
    const frontendUrl = 'https://fueldeliveryapp-1.onrender.com';
    const backendUrl = 'https://fuel-delivery-backend.onrender.com';

    try {
        // Test 1: Health Check
        console.log('\n🔍 Testing backend health...');
        console.log('Making request to:', `${backendUrl}/api/health`);
        const health = await axios.get(`${backendUrl}/api/health`, {
            headers: {
                Origin: frontendUrl,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Backend is healthy:', health.data);

        // Test 2: Login
        console.log('\n🔍 Testing login endpoint...');
        console.log('Making request to:', `${backendUrl}/api/auth/login`);
        const login = await axios.post(`${backendUrl}/api/auth/login`, {
            email: 'eeznetsolutions@gmail.com',
            password: 'admin123'
        }, {
            headers: {
                Origin: frontendUrl,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Login endpoint working:', login.data);

        // Test 3: Registration
        console.log('\n🔍 Testing registration endpoint...');
        console.log('Making request to:', `${backendUrl}/api/auth/register`);
        const testEmail = `test.client.${Date.now()}@example.com`;
        const register = await axios.post(`${backendUrl}/api/auth/register`, {
            name: 'Test Client',
            email: testEmail,
            password: 'client123',
            role: 'client'
        }, {
            headers: {
                Origin: frontendUrl,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Registration endpoint working:', register.data);

    } catch (error) {
        console.error('❌ Test failed:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            endpoint: error.config?.url,
            headers: error.config?.headers
        });
    }
};

// Run tests
console.log('🚀 Starting connection tests...');
testConnection().then(() => {
    console.log('\n✨ Tests completed');
}).catch(error => {
    console.error('\n💥 Tests failed:', error);
    process.exit(1);
}); 