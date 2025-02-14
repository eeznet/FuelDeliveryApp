import express from 'express';
import { body, validationResult } from 'express-validator';
import driverController from '../controllers/drivercontroller';  // Assuming controller exists
import authMiddleware from '../middleware/authMiddleware';
import logger from '../config/logger'; // Importing logger

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
        logger.error('Error fetching driver data:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error fetching driver data', error: error.message });
    }
});

// Log a trip (ensure the user is authenticated as a driver)
router.post(
    '/log-trip',
    [
        body('tripDate')
            .notEmpty().withMessage('Trip date is required')
            .isDate().withMessage('Invalid trip date format').trim(),
        body('destination')
            .notEmpty().withMessage('Destination is required').trim(),
        body('fuelAmount')
            .isNumeric().withMessage('Fuel amount must be a number')
            .isFloat({ gt: 0 }).withMessage('Fuel amount must be greater than zero')
            .custom((value) => {
                if (value > 1000) {
                    throw new Error('Fuel amount is too high. Check the value.');
                }
                return true;
            }),
    ],
    validateRequest, // Validation middleware
    async (req, res) => {
        try {
            const result = await driverController.logTrip(req);
            res.status(201).json({ success: true, data: result, message: 'Trip logged successfully.' });
        } catch (error) {
            logger.error('Error logging trip:', { error: error.message, stack: error.stack });
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
        logger.error('Error fetching truck location:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error fetching truck location', error: error.message });
    }
});

// Update driver information (ensure the user is authenticated as a driver)
router.put(
    '/update-driver',
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
        body('email')
            .optional()
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
        body('phone')
            .optional()
            .isMobilePhone().withMessage('Invalid phone number format')
            .trim(),
    ],
    validateRequest, // Validation middleware
    async (req, res) => {
        try {
            const updatedInfo = await driverController.updateDriver(req);
            res.status(200).json({ success: true, data: updatedInfo, message: 'Driver info updated successfully.' });
        } catch (error) {
            logger.error('Error updating driver info:', { error: error.message, stack: error.stack });
            res.status(500).json({ success: false, message: 'Error updating driver info', error: error.message });
        }
    }
);

export default router;
