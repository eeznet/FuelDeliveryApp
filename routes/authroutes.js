import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import pool from '../config/database.js';
import logger from '../config/logger.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration validation
const validateRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').custom(async (value) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [value]);
        if (result.rows.length > 0) {
            throw new Error('Email already exists');
        }
        return true;
    }),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['client', 'driver']).withMessage('Invalid role'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0];
            return res.status(400).json({
                success: false,
                message: firstError.msg
            });
        }
        next();
    }
];

// Login validation
const validateLogin = [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0];
            return res.status(400).json({
                success: false,
                message: firstError.msg
            });
        }
        next();
    }
];

// Routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', auth, logout);

export default router;
