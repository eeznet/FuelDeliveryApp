const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const PriceController = require('../controllers/pricecontroller'); // Ensure this controller is implemented

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

// Route to get all prices
router.get('/', async (req, res) => {
  try {
    const prices = await PriceController.getAllPrices(req, res);
    if (!prices.length) {
      return res.status(204).json({ success: true, message: 'No prices found.' });
    }
    res.status(200).json({ success: true, message: 'Prices fetched successfully', data: prices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ success: false, message: 'Error fetching prices', error: error.message });
  }
});

// Route to add a new price
router.post(
  '/',
  [
    body('fuelType').isString().withMessage('Fuel type is required'), // Validate fuel type
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .notEmpty()
      .withMessage('Price is required'), // Validate price
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      const newPrice = await PriceController.addPrice(req, res);
      res.status(201).json({ success: true, message: 'Price added successfully', data: newPrice });
    } catch (error) {
      console.error('Error adding price:', error);
      res.status(500).json({ success: false, message: 'Error adding price', error: error.message });
    }
  }
);

// Route to update an existing price
router.put(
  '/:id',
  [
    body('fuelType').optional().isString().withMessage('Fuel type should be a string'), // Optional fuel type validation
    body('price').optional().isNumeric().withMessage('Price must be a number'), // Optional price validation
  ],
  validateRequest, // Validation middleware
  async (req, res) => {
    try {
      const updatedPrice = await PriceController.updatePrice(req, res);
      if (!updatedPrice) {
        return res.status(404).json({ success: false, message: 'Price not found' });
      }
      res.status(200).json({ success: true, message: 'Price updated successfully', data: updatedPrice });
    } catch (error) {
      console.error('Error updating price:', error);
      res.status(500).json({ success: false, message: 'Error updating price', error: error.message });
    }
  }
);

// Route to delete a price
router.delete('/:id', async (req, res) => {
  try {
    const deletedPrice = await PriceController.deletePrice(req, res);
    if (!deletedPrice) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }
    res.status(200).json({ success: true, message: 'Price deleted successfully' });
  } catch (error) {
    console.error('Error deleting price:', error);
    res.status(500).json({ success: false, message: 'Error deleting price', error: error.message });
  }
});

module.exports = router;
