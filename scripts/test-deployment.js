import axios from 'axios';
import { fileURLToPath } from 'url';
import logger from '../config/logger.mjs';

const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://fuel-delivery-backend.onrender.com'
    : 'http://localhost:3000';

async function testDeployment() {
    try {
        logger.info('Testing deployment...');
        
        // Test root endpoint
        const rootResponse = await axios.get(BASE_URL);
        logger.info('Root endpoint:', rootResponse.data);

        // Test health endpoint
        const healthResponse = await axios.get(`${BASE_URL}/api/health`);
        logger.info('Health check:', healthResponse.data);

        if (healthResponse.data.status === 'ok') {
            logger.info('✅ Deployment test passed');
            return true;
        } else {
            logger.error('❌ Deployment test failed: Health check returned non-ok status');
            return false;
        }
    } catch (error) {
        logger.error('❌ Deployment test failed:', error.message);
        if (error.response) {
            logger.error('Response data:', error.response.data);
            logger.error('Response status:', error.response.status);
        }
        return false;
    }
}

// Run the test if this file is executed directly
if (import.meta.url === fileURLToPath(import.meta.url)) {
    testDeployment()
        .then(success => process.exit(success ? 0 : 1))
        .catch(error => {
            logger.error('Unexpected error:', error);
            process.exit(1);
        });
}

export default testDeployment; 