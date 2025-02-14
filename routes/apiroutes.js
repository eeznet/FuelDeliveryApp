const express = require('express');
const truckLocationController = require('../controllers/trucklocationcontroller');
const invoiceController = require('../controllers/invoicecontroller');
const authMiddleware = require('../middleware/authMiddleware');
const Invoice = require('../models/invoice');
const User = require('../models/user');
const mongoose = require('mongoose');
const logger = require('../config/logger'); // Use structured logging

const router = express.Router();

// Truck Location - Driver Route
router.get('/truck-location/:id', authMiddleware(['driver']), truckLocationController.getTruckLocation);

// Create Invoice - Owner Only
router.post('/invoice', authMiddleware(['owner']), invoiceController.createInvoice);

// Get All Invoices (Owner Only)
router.get('/invoices', authMiddleware(['owner']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(pageLimit) || pageNumber <= 0 || pageLimit <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
        }

        const [invoices, totalCount] = await Promise.all([
            Invoice.find()
                .select('invoiceId clientName totalAmount dueDate status')
                .skip((pageNumber - 1) * pageLimit)
                .limit(pageLimit),
            Invoice.countDocuments(),
        ]);

        res.json({
            success: true,
            data: invoices,
            pagination: { total: totalCount, page: pageNumber, limit: pageLimit, totalPages: Math.ceil(totalCount / pageLimit) },
        });
    } catch (error) {
        logger.error('Error fetching invoices', { error: error.message });
        res.status(500).json({ success: false, message: 'Error fetching invoices. Please try again later.' });
    }
});

// Get Single Invoice (Owner Only)
router.get('/invoice/:invoiceId', authMiddleware(['owner']), async (req, res) => {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return res.status(400).json({ success: false, message: 'Invalid invoice ID format.' });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }
        res.json({ success: true, data: invoice });
    } catch (error) {
        logger.error('Error fetching invoice', { error: error.message });
        res.status(500).json({ success: false, message: 'Error fetching invoice. Please try again later.' });
    }
});

// Update Invoice - Owner Only
router.put('/invoice/:invoiceId', authMiddleware(['owner']), invoiceController.updateInvoice);

// Delete Invoice - Owner Only
router.delete('/invoice/:invoiceId', authMiddleware(['owner']), invoiceController.deleteInvoice);

// Admin Route - Get All Invoices (Pagination)
router.get('/admin/invoices', authMiddleware(['admin']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);

        const [invoices, totalCount] = await Promise.all([
            Invoice.find()
                .select('invoiceId clientName totalAmount dueDate status')
                .skip((pageNumber - 1) * pageLimit)
                .limit(pageLimit),
            Invoice.countDocuments(),
        ]);

        res.json({
            success: true,
            data: invoices,
            pagination: { total: totalCount, page: pageNumber, limit: pageLimit, totalPages: Math.ceil(totalCount / pageLimit) },
        });
    } catch (error) {
        logger.error('Error fetching admin invoices', { error: error.message });
        res.status(500).json({ success: false, message: 'Error fetching invoices. Please try again later.' });
    }
});

// Protected Route - Authenticated Access Only
router.get('/protected', authMiddleware(), (req, res) => {
    res.json({ success: true, message: 'This is a protected route' });
});

// Test MongoDB - Get all users (for debugging purposes)
router.get('/test-mongo', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password for security
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users from MongoDB', { error: error.message });
        res.status(500).json({ success: false, message: 'Error fetching data from MongoDB' });
    }
});

// Catch-all error handler for API routes
router.use((err, req, res, next) => {
    logger.error('API Routes Error', { error: err.message, stack: err.stack });
    const response = { success: false, message: 'Internal server error' };
    if (process.env.NODE_ENV !== 'production') response.stack = err.stack;
    res.status(500).json(response);
});

module.exports = router;
