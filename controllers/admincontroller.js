import mongoose from "mongoose";
import User from "../models/user.js";
import Invoice from "../models/invoice.js";
import Price from "../models/price.js";
import logger from "../config/logger.js"; // Winston logger

// Get Admin Dashboard Data
const getAdminDashboard = async (req, res) => {
  try {
    logger.info(`Admin Dashboard Request - Admin: ${req.user?.email || "Unknown"}`);

    const [userCount, invoiceCount, recentPrices] = await Promise.all([
      User.countDocuments(),
      Invoice.countDocuments(),
      Price.find().sort({ createdAt: -1 }).limit(5).lean(), // Faster read operation
    ]);

    res.status(200).json({
      success: true,
      message: "Admin Dashboard Data Retrieved",
      data: { userCount, invoiceCount, recentPrices },
    });
  } catch (error) {
    logger.error(`Error fetching admin dashboard data: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Manage Users - List All Users (Excluding Passwords)
const manageUsers = async (req, res) => {
  try {
    logger.info(`Manage Users Request - Admin: ${req.user?.email || "Unknown"}`);

    const users = await User.find().select("-password").lean(); // Exclude passwords, optimize performance
    res.status(200).json({
      success: true,
      message: "User list retrieved successfully",
      data: users,
    });
  } catch (error) {
    logger.error(`Error fetching user data: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete User by ID (Admin-Only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Delete User Request - Admin: ${req.user?.email || "Unknown"}, Target User ID: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const deletedUser = await User.findByIdAndDelete(userId).lean();
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id: deletedUser._id, email: deletedUser.email },
    });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getAdminDashboard, manageUsers, deleteUser };
