import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import logger from "../config/logger.js";

// Register user
export const register = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed: Email already exists - ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const user = new User(req.body);
    await user.save();

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      logger.warn(`Login failed: User not found - ${email}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      logger.warn(`Login failed: Account disabled - ${email}`);
      return res.status(403).json({
        success: false,
        message: 'Account disabled'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid credentials - ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = user.generateToken();
    logger.info(`Login successful: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    logger.info("User logged out successfully");
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: "Server error during logout" 
    });
  }
};
