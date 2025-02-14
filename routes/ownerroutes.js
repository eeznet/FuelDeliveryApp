import express from 'express';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';
import roleCheck from '../middleware/roleCheck'; // Ensure correct path
import OwnerController from '../controllers/ownerController'; // Correct path
import logger from '../config/logger'; // Import logger for better error handling

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

// Apply authentication middleware to all routes in this file
router.use(authMiddleware()); // Ensure authentication middleware is used for all routes

// Ensure 'owner' role for all routes below
router.use(roleCheck(['owner'])); // Ensure that only users with the 'owner' role can access these routes

// Get owner data
router.get('/data', async (req, res) => {
    try {
        const data = await OwnerController.getOwnerData(req.user); // Pass authenticated user data
        res.status(200).json({ success: true, data, message: 'Owner data fetched successfully.' });
    } catch (error) {
        logger.error('Error fetching owner data:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error fetching owner data', error: error.message });
    }
});

// Update owner information
router.put(
    '/update',
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
        body('email')
            .optional()
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail()
            .custom((value) => {
                // Optionally check if email is already taken (if applicable)
                return true;
            }),
        body('phone')
            .optional()
            .isMobilePhone().withMessage('Invalid phone number format')
            .trim()
            .custom((value) => {
                if (value && value.length < 10) {
                    throw new Error('Phone number must be at least 10 digits long.');
                }
                return true;
            }),
    ],
    validateRequest, // Validation middleware
    async (req, res) => {
        try {
            // Ensure that the owner exists and update only the authenticated owner's data
            await OwnerController.updateOwnerInfo(req.user, req.body); // Pass authenticated user info
            res.status(200).json({ success: true, message: 'Owner information updated successfully.' });
        } catch (error) {
            logger.error('Error updating owner information:', { error: error.message, stack: error.stack });
            res.status(500).json({ success: false, message: 'Error updating owner information', error: error.message });
        }
    }
);

// Get all drivers data (Owner controls all drivers)
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await OwnerController.getAllDrivers(); // Fetch all drivers controlled by the owner
        res.status(200).json({ success: true, data: drivers, message: 'All drivers fetched successfully.' });
    } catch (error) {
        logger.error('Error fetching drivers data:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error fetching drivers data', error: error.message });
    }
});

// Get all clients data (Owner controls all clients)
router.get('/clients', async (req, res) => {
    try {
        const clients = await OwnerController.getAllClients(); // Fetch all clients controlled by the owner
        res.status(200).json({ success: true, data: clients, message: 'All clients fetched successfully.' });
    } catch (error) {
        logger.error('Error fetching clients data:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error fetching clients data', error: error.message });
    }
});

// Update a driver’s information (Owner controls driver updates)
router.put(
    '/drivers/:driverId',
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
            const updatedDriver = await OwnerController.updateDriverInfo(req.params.driverId, req.body);
            res.status(200).json({ success: true, data: updatedDriver, message: 'Driver information updated successfully.' });
        } catch (error) {
            logger.error('Error updating driver information:', { error: error.message, stack: error.stack });
            res.status(500).json({ success: false, message: 'Error updating driver information', error: error.message });
        }
    }
);

// Update a client’s information (Owner controls client updates)
router.put(
    '/clients/:clientId',
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
            const updatedClient = await OwnerController.updateClientInfo(req.params.clientId, req.body);
            res.status(200).json({ success: true, data: updatedClient, message: 'Client information updated successfully.' });
        } catch (error) {
            logger.error('Error updating client information:', { error: error.message, stack: error.stack });
            res.status(500).json({ success: false, message: 'Error updating client information', error: error.message });
        }
    }
);

// Additional owner-specific routes can be added here...

export default router;
