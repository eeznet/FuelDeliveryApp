import express from 'express';
import { auth, checkRole } from '../middleware/authMiddleware.mjs';
import pool from '../config/database.mjs';
import logger from '../config/logger.mjs';

const router = express.Router();

// Log middleware for invoice routes
router.use((req, res, next) => {
    logger.info('Invoice route middleware:', {
        method: req.method,
        path: req.path
    });
    next();
});

// Create new invoice
router.post('/', auth, checkRole(['client']), async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { liters, address } = req.body;
        
        // Get current fuel price
        const priceResult = await client.query(
            'SELECT price_per_liter FROM fuel_prices ORDER BY created_at DESC LIMIT 1'
        );
        
        if (priceResult.rows.length === 0) {
            throw new Error('No fuel price set');
        }
        
        const pricePerLiter = priceResult.rows[0].price_per_liter;
        const totalPrice = liters * pricePerLiter;
        
        // Create invoice
        const invoiceResult = await client.query(
            `INSERT INTO invoices 
            (client_id, liters_delivered, price_per_liter, total_price, address, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id`,
            [req.user.id, liters, pricePerLiter, totalPrice, address, 'pending']
        );
        
        // Create delivery record
        await client.query(
            `INSERT INTO deliveries 
            (invoice_id, status) 
            VALUES ($1, $2)`,
            [invoiceResult.rows[0].id, 'pending']
        );
        
        await client.query('COMMIT');
        
        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully',
            invoiceId: invoiceResult.rows[0].id
        });
    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error creating invoice:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to create order' 
        });
    } finally {
        client.release();
    }
});

// Get client's invoices
router.get('/client', auth, checkRole(['client']), async (req, res) => {
    logger.info('Handling GET /client request');
    try {
        const result = await pool.query(
            `SELECT i.*, d.status as delivery_status 
            FROM invoices i 
            LEFT JOIN deliveries d ON i.id = d.invoice_id 
            WHERE i.client_id = $1 
            ORDER BY i.created_at DESC`,
            [req.user.id]
        );
        
        res.json({
            success: true,
            invoices: result.rows
        });
    } catch (error) {
        logger.error('Error fetching client invoices:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch orders' 
        });
    }
});

// Get all invoices (admin/owner only)
router.get('/all', auth, checkRole(['admin', 'owner']), async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.*, u.name as client_name, d.status as delivery_status 
            FROM invoices i 
            LEFT JOIN users u ON i.client_id = u.id 
            LEFT JOIN deliveries d ON i.id = d.invoice_id 
            ORDER BY i.created_at DESC`
        );
        
        res.json({
            success: true,
            invoices: result.rows
        });
    } catch (error) {
        logger.error('Error fetching all invoices:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch invoices' 
        });
    }
});

export default router; 