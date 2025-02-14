import express from 'express';
import { body, validationResult } from 'express-validator';
import PriceController from '../controllers/priceController'; // Ensure controller exists
import authMiddleware from '../middleware/authMiddleware'; // Authentication middleware
import roleCheck from '../middleware/roleCheck'; // Role-based access control middleware
import logger from '../config/logger'; // For logging errors

const router = express.Router();

// Utility function to check validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array().map((err) => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    next();
};

// Apply authentication and role-based middleware for owner access
router.use(authMiddleware());
router.use(roleCheck(['owner'])); // Ensure only owners can modify prices

// Route to get all prices
router.get('/', async (req, res) => {
    try {
        const prices = await PriceController.getAllPrices();
        if (!prices.length) {
            return res.status(204).json({ success: true, message: 'No prices found.' });
        }
        res.status(200).json({ success: true, message: 'Prices fetched successfully', data: prices });
    } catch (error) {
        logger.error('Error fetching prices:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error fetching prices', error: error.message });
    }
});

// Route to add a new price
router.post(
    '/',
    [
        body('fuelType')
            .isIn(['93', '95', 'diesel'])
            .withMessage('Invalid fuel type. Please choose from 93, 95, or diesel'),
        body('price')
            .isNumeric()
            .withMessage('Price must be a numeric value')
            .notEmpty()
            .withMessage('Price is required')
            .custom((value) => {
                if (value <= 0) {
                    throw new Error('Price must be greater than 0');
                }
                return true;
            }),
    ],
    validateRequest, // Validation middleware
    async (req, res) => {
        try {
            const newPrice = await PriceController.addPrice(req.body);
            res.status(201).json({ success: true, message: 'Price added successfully', data: newPrice });
        } catch (error) {
            logger.error('Error adding price:', { error: error.message, stack: error.stack });
            res.status(500).json({ success: false, message: 'Error adding price', error: error.message });
        }
    }
);

// Route to update an existing price
router.put(
    '/:id',
    [
        body('fuelType')
            .optional()
            .isIn(['93', '95', 'diesel'])
            .withMessage('Invalid fuel type. Please choose from 93, 95, or diesel'),
        body('price')
            .optional()
            .isNumeric()
            .withMessage('Price must be a numeric value')
            .custom((value) => {
                if (value <= 0) {
                    throw new Error('Price must be greater than 0');
                }
                return true;
            }),
    ],
    validateRequest, // Validation middleware
    async (req, res) => {
        try {
            const updatedPrice = await PriceController.updatePrice(req.params.id, req.body);
            if (!updatedPrice) {
                return res.status(404).json({
                    success: false,
                    message: `Price with ID ${req.params.id} not found`,
                });
            }
            res.status(200).json({
                success: true,
                message: 'Price updated successfully',
                data: updatedPrice,
            });
        } catch (error) {
            logger.error('Error updating price:', { error: error.message, stack: error.stack });
            res.status(500).json({ success: false, message: 'Error updating price', error: error.message });
        }
    }
);

// Route to delete a price
router.delete('/:id', async (req, res) => {
    try {
        const deletedPrice = await PriceController.deletePrice(req.params.id);
        if (!deletedPrice) {
            return res.status(404).json({
                success: false,
                message: `Price with ID ${req.params.id} not found`,
            });
        }
        res.status(200).json({ success: true, message: 'Price deleted successfully' });
    } catch (error) {
        logger.error('Error deleting price:', { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: 'Error deleting price', error: error.message });
    }
});

export default router;
