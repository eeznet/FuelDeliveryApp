import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import User from '../models/user.js';
import logger from '../config/logger.js';

const router = express.Router();

// Registration validation
const validateRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        return true;
    }),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['owner', 'driver', 'client', 'admin']).withMessage('Invalid role'),
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
router.post('/logout', logout);

export default router;
