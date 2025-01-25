const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleCheck'); // Corrected import path
const { body, validationResult } = require('express-validator');
const OwnerController = require('../controllers/ownercontroller'); // Corrected import path

// Utility function for checking validation errors
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

// Apply authentication middleware to all routes in this file
router.use(authMiddleware()); // Ensure authentication middleware is used for all routes

// Ensure 'owner' role for all routes below
router.use(roleCheck(['owner'])); // Ensure that only users with the 'owner' role can access these routes

// Get owner data
router.get('/data', async (req, res) => {
  try {
    const data = await OwnerController.getOwnerData(req.user);
    res.status(200).json({ success: true, data, message: 'Owner data fetched successfully.' });
  } catch (error) {
    console.error('Error fetching owner data:', error);
    res.status(500).json({ success: false, message: 'Error fetching owner data', error: error.message });
  }
});

// Update owner information
router.put(
  '/update',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
    body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
    // Add more validations as needed for other fields
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      await OwnerController.updateOwnerInfo(req.user, req.body);
      res.status(200).json({ success: true, message: 'Owner information updated successfully.' });
    } catch (error) {
      console.error('Error updating owner information:', error);
      res.status(500).json({ success: false, message: 'Error updating owner information', error: error.message });
    }
  }
);

// Add more owner-specific routes here...

module.exports = router;
