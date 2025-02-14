import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'; // Updated to include updateProfile function
import auth from '../middleware/authMiddleware.js';
import logger from '../config/logger.js';

const router = express.Router();

// Route to get user profile (protected)
router.get('/profile', auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Route to update user profile (protected)
router.put('/profile', auth, updateUserProfile); // Added update profile route

export default router;
