const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware
const admincontroller = require('../controllers/admincontroller'); // Import admin controller

// Admin-specific routes

// Admin dashboard route
router.get('/dashboard', authMiddleware(['admin']), admincontroller.getAdminDashboard);

// Manage users route
router.get('/manage-users', authMiddleware(['admin']), admincontroller.manageUsers);

// Delete user route
router.delete('/delete-user/:userId', authMiddleware(['admin']), admincontroller.deleteUser);

// Catch-all error handler for admin routes (optional, useful for debugging)
router.use((err, req, res, next) => {
    console.error('Admin Routes Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error in admin routes' });
});

module.exports = router;
