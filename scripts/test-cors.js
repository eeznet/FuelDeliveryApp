import axios from 'axios';

const testEndpoint = 'https://fueldeliverywebapp.onrender.com/api/auth/login';
const testOrigin = 'https://fueldeliveryapp-1.onrender.com';

async function testCORS() {
    try {
        // Test OPTIONS (preflight)
        console.log('Testing OPTIONS request...');
        const options = await axios({
            method: 'OPTIONS',
            url: testEndpoint,
            headers: {
                'Origin': testOrigin,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
        });
        console.log('OPTIONS success:', options.headers);

        // Test actual login
        console.log('\nTesting POST request...');
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
        console.log('POST success:', login.data);

    } catch (error) {
        console.error('Test failed:', {
            message: error.message,
            response: error.response?.data,
            headers: error.response?.headers
        });
    }
}

testCORS(); 