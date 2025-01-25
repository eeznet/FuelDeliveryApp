const express = require('express');
const driverController = require('../controllers/drivercontroller'); // Assuming controller exists
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const router = express.Router();

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

// Get driver data (ensure the user is authenticated as a driver)
router.get('/driver-data', authMiddleware('driver'), async (req, res) => {
  try {
    const data = await driverController.getDriverData(req);
    res.status(200).json({ success: true, data, message: 'Driver data fetched successfully.' });
  } catch (error) {
    console.error('Error fetching driver data:', error);
    res.status(500).json({ success: false, message: 'Error fetching driver data', error: error.message });
  }
});

// Log a trip (ensure the user is authenticated as a driver)
router.post(
  '/log-trip',
  [
    body('tripDate').notEmpty().withMessage('Trip date is required').trim(),
    body('destination').notEmpty().withMessage('Destination is required').trim(),
    body('fuelAmount').isNumeric().withMessage('Fuel amount must be a number'),
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      const result = await driverController.logTrip(req); // Directly pass req to controller
      res.status(201).json({ success: true, data: result, message: 'Trip logged successfully.' });
    } catch (error) {
      console.error('Error logging trip:', error);
      res.status(500).json({ success: false, message: 'Error logging trip', error: error.message });
    }
  }
);

// Get driver's truck location (ensure the user is authenticated as a driver)
router.get('/truck-location', authMiddleware('driver'), async (req, res) => {
  try {
    const location = await driverController.getTruckLocation(req);
    res.status(200).json({ success: true, data: location, message: 'Truck location fetched successfully.' });
  } catch (error) {
    console.error('Error fetching truck location:', error);
    res.status(500).json({ success: false, message: 'Error fetching truck location', error: error.message });
  }
});

// Update driver information (ensure the user is authenticated as a driver)
router.put(
  '/update-driver',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
    body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
    // Add other driver info validations as needed
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      const updatedInfo = await driverController.updateDriver(req); // Directly pass req to controller
      res.status(200).json({ success: true, data: updatedInfo, message: 'Driver info updated successfully.' });
    } catch (error) {
      console.error('Error updating driver info:', error);
      res.status(500).json({ success: false, message: 'Error updating driver info', error: error.message });
    }
  }
);

module.exports = router;
