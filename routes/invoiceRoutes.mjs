import express from 'express';
import { auth, checkRole } from '../middleware/authMiddleware.mjs';
import pool from '../config/database.mjs';
import logger from '../config/logger.mjs';

const router = express.Router();

// Basic invoice route
router.get('/', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Invoice route working'
        });
    } catch (error) {
        console.error('Invoice route error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router; 