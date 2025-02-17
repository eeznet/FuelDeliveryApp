import express from 'express';
import { auth, checkRole } from '../middleware/authMiddleware.mjs';
import pool from '../config/database.mjs';
import logger from '../config/logger.mjs';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    const { name, email } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
            [name, email, req.user.id]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        logger.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

export default router;
