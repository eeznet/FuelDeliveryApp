const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const adminController = require('../controllers/admincontroller');
const logger = require('../config/logger'); // Use structured logging

// Admin dashboard route
router.get('/dashboard', authMiddleware(['admin']), adminController.getAdminDashboard);

// Manage users route
router.get('/manage-users', authMiddleware(['admin']), adminController.manageUsers);

// Delete user route
router.delete('/delete-user/:userId', authMiddleware(['admin']), adminController.deleteUser);

// Catch-all error handler for admin routes
router.use((err, req, res, next) => {
    logger.error(`Admin Routes Error: ${err.message}`, { stack: err.stack });

    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
        res.status(500).json({ 
            success: false, 
            message: err.message, 
            stack: err.stack 
        });
    }
});

module.exports = router;
