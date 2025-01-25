const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authcontroller');
const User = require('../models/user'); // Ensure this path is correct
const router = express.Router();

// Utility function to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Register Route
router.post(
  '/register',
  [
    // Validate email format and uniqueness
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('Email is already registered');
        }
        return true;
      }),
    // Validate password length
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    // Validate role
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['owner', 'driver', 'client', 'admin'])
      .withMessage('Invalid role provided'),
    // Sanitize inputs
    body('email').normalizeEmail(),
    body('password').trim(),
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      // Call the controller to handle registration
      await authController.registerUser(req, res);
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({
        success: false,
        message: 'Error during registration',
        error: error.message,
      });
    }
  }
);

// Login Route
router.post(
  '/login',
  [
    // Validate email and password
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim(),
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      // Call the controller to handle login
      await authController.loginUser(req, res);
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message,
      });
    }
  }
);

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    await authController.forgotPassword(req, res);
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request',
      error: error.message,
    });
  }
});

module.exports = router;
