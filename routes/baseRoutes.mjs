import express from 'express';
import logger from '../config/logger.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    logger.info('Root endpoint hit');
    res.json({ 
        message: 'Fuel Delivery API is running',
        timestamp: new Date().toISOString()
    });
});

router.get('/health', (req, res) => {
    logger.info('Health check endpoint hit');
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

router.get('/test', (req, res) => {
    logger.info('Test endpoint hit');
    res.json({
        message: 'API is accessible',
        timestamp: new Date().toISOString()
    });
});

export default router; 