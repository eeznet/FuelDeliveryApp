// controllers/userController.js
import User from "../models/user.js";

// Get user profile (based on ID)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // We are using the User model only now
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update fields as needed
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Add any additional fields you want to update

        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
