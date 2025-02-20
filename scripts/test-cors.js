import axios from 'axios';

const testCORS = async () => {
    try {
        // Test preflight
        const options = await axios.options('https://fuel-delivery-backend.onrender.com/api/auth/login', {
            headers: {
                'Origin': 'https://fueldeliveryapp-1.onrender.com'
            }
        });
        console.log('Preflight response headers:', options.headers);

        // Test actual request
        const response = await axios.post('https://fuel-delivery-backend.onrender.com/api/auth/login', 
            { email: 'test@example.com', password: 'password' },
            {
                headers: {
                    'Origin': 'https://fueldeliveryapp-1.onrender.com',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Request successful:', response.data);
    } catch (error) {
        console.error('Test failed:', {
            message: error.message,
            response: error.response?.data,
            headers: error.response?.headers
        });
    }
};

testCORS(); 