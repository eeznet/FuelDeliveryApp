const User = require('../models/user'); // Adjust path if necessary
const Invoice = require('../models/invoice'); // Ensure model exists
const Price = require('../models/price'); // Ensure model exists

// Controller to handle admin dashboard access
const getAdminDashboard = async (req, res) => {
    try {
        // Fetch admin-relevant data
        const userCount = await User.countDocuments();
        const invoiceCount = await Invoice.countDocuments();
        const recentPrices = await Price.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            message: 'Admin Dashboard Data Retrieved',
            data: {
                userCount,
                invoiceCount,
                recentPrices: recentPrices || [], // Return an empty array if no prices are found
            },
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard data' });
    }
};

// Controller to manage user accounts (list, delete, etc.)
const manageUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Fetch users without exposing passwords
        res.status(200).json({
            success: true,
            message: 'User list retrieved successfully',
            data: users || [], // Return an empty array if no users are found
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

// Controller to delete a user by ID (admin-only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
};

// Export the functions
module.exports = {
    getAdminDashboard,
    manageUsers,
    deleteUser,
};
