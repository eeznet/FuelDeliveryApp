import express from 'express';
import { auth, checkRole } from '../middleware/authMiddleware.js';
import pool from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Deliveries Routes
router.get('/deliveries/driver', auth, checkRole(['driver']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM deliveries WHERE driver_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching driver deliveries:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch deliveries' });
    }
});

// Admin Stats Route
router.get('/admin/stats', auth, checkRole(['admin']), async (req, res) => {
    try {
        const stats = {
            totalUsers: (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count,
            totalOrders: (await pool.query('SELECT COUNT(*) FROM invoices')).rows[0].count,
            activeDrivers: (await pool.query('SELECT COUNT(*) FROM users WHERE role = $1 AND is_active = true', ['driver'])).rows[0].count,
            pendingDeliveries: (await pool.query('SELECT COUNT(*) FROM deliveries WHERE status = $1', ['pending'])).rows[0].count
        };
        res.json(stats);
    } catch (error) {
        logger.error('Error fetching admin stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

// Owner Stats Route
router.get('/owner/stats', auth, checkRole(['owner']), async (req, res) => {
    try {
        const stats = {
            totalRevenue: (await pool.query('SELECT SUM(total_price) FROM invoices')).rows[0].sum,
            monthlyRevenue: (await pool.query('SELECT SUM(total_price) FROM invoices WHERE created_at >= NOW() - INTERVAL \'30 days\'')).rows[0].sum,
            totalDeliveries: (await pool.query('SELECT COUNT(*) FROM deliveries')).rows[0].count,
            activeOrders: (await pool.query('SELECT COUNT(*) FROM invoices WHERE status = $1', ['pending'])).rows[0].count
        };
        res.json(stats);
    } catch (error) {
        logger.error('Error fetching owner stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

// Price Management Routes
router.post('/price', auth, checkRole(['owner']), async (req, res) => {
    try {
        const { pricePerLiter } = req.body;
        await pool.query(
            'INSERT INTO fuel_prices (price_per_liter, created_by) VALUES ($1, $2)',
            [pricePerLiter, req.user.id]
        );
        res.json({ success: true, message: 'Price updated successfully' });
    } catch (error) {
        logger.error('Error updating fuel price:', error);
        res.status(500).json({ success: false, message: 'Failed to update price' });
    }
});

// Admin Routes
router.get('/admin/users', auth, checkRole(['admin']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, is_active FROM users WHERE role != $1',
            ['owner']
        );
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

router.put('/admin/users/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        
        await pool.query(
            'UPDATE users SET is_active = $1 WHERE id = $2',
            [is_active, id]
        );
        
        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});

// Delivery Routes
router.put('/deliveries/:id/status', auth, checkRole(['driver']), async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        const { status } = req.body;
        
        await client.query(
            'UPDATE deliveries SET status = $1, completed_at = NOW() WHERE id = $2 AND driver_id = $3',
            [status, id, req.user.id]
        );
        
        await client.query(
            'UPDATE invoices SET status = $1 WHERE id = (SELECT invoice_id FROM deliveries WHERE id = $2)',
            [status, id]
        );
        
        await client.query('COMMIT');
        res.json({ success: true, message: 'Delivery status updated' });
    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error updating delivery status:', error);
        res.status(500).json({ success: false, message: 'Failed to update delivery status' });
    } finally {
        client.release();
    }
});

export default router;
