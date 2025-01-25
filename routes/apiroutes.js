const express = require('express');
const truckLocationController = require('../controllers/trucklocationcontroller');
const invoiceController = require('../controllers/invoicecontroller');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the path is correct
const Invoice = require('../models/invoice');
const router = express.Router();

// Truck Location - Driver Route
router.get('/truck-location/:id', authMiddleware(['driver']), truckLocationController.getTruckLocation);

// Invoices - Owner Routes (Manage invoices)
router.post('/invoice', authMiddleware(['owner']), invoiceController.createInvoice);

// Get All Invoices with Pagination (Owner Only)
router.get('/invoices', authMiddleware(['owner']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Validate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(pageLimit) || pageNumber <= 0 || pageLimit <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pagination parameters. Page and limit must be positive integers.',
        });
    }

    try {
        const invoices = await Invoice.find()
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);

        res.json({ success: true, data: invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoices. Please try again later.',
        });
    }
});

// Get Single Invoice by ID (Owner Only)
router.get('/invoice/:invoiceId', authMiddleware(['owner']), async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found',
            });
        }

        res.json({ success: true, data: invoice });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoice. Please try again later.',
        });
    }
});

// Update Invoice - Owner Route
router.put('/invoice/:invoiceId', authMiddleware(['owner']), invoiceController.updateInvoice);

// Delete Invoice - Owner Route
router.delete('/invoice/:invoiceId', authMiddleware(['owner']), invoiceController.deleteInvoice);

// Admin-Specific Route (New)
router.get('/admin/invoices', authMiddleware(['admin']), async (req, res) => {  
    try {
        const invoices = await Invoice.find(); // Admin gets access to all invoices without pagination
        res.json({ success: true, data: invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoices. Please try again later.',
        });
    }
});

// Protected Route - Authenticated Access Only
router.get('/protected', authMiddleware(), (req, res) => {
    res.json({ success: true, message: 'This is a protected route' });
});

module.exports = router;
