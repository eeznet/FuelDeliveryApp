import express from 'express';
import logger from '../config/logger.mjs';
import { pool } from '../config/database.mjs';
import mongoose from 'mongoose';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
    logger.info('Test endpoint hit');
    res.json({
        success: true,
        message: 'API is accessible',
        timestamp: new Date().toISOString(),
        cors: {
            origin: req.headers.origin || 'no origin'
        }
    });
});

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        const pgResult = await pool.query('SELECT NOW()');
        const mongoStatus = mongoose.connection.readyState === 1;

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            databases: {
                postgres: pgResult ? 'connected' : 'disconnected',
                mongodb: mongoStatus ? 'connected' : 'disconnected'
            }
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router; 