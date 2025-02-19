import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
    const [status, setStatus] = useState('Testing...');

    useEffect(() => {
        const testApi = async () => {
            try {
                const response = await axios.get('https://fuel-delivery-backend.onrender.com/api/test');
                setStatus(`API is accessible: ${JSON.stringify(response.data)}`);
            } catch (error) {
                setStatus(`API error: ${error.message}`);
                console.error('API test error:', error);
            }
        };

        testApi();
    }, []);

    return <div>{status}</div>;
};

export default ApiTest; 