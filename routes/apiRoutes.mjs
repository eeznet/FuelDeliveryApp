import express from 'express';
import { auth, checkRole } from '../middleware/authMiddleware.js';
import pool from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// ✅ Test API route
router.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working correctly!"
    });
});

// ✅ Deliveries Routes
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

// ✅ Admin Stats Route
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

// ✅ Owner Stats Route
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

// ✅ Health Check Route
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cors: {
            origin: req.headers.origin,
            method: req.method
        }
    });
});

export default router;
