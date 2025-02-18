import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import logger from '../config/logger.mjs';
import pool from '../config/database.mjs';  // Note the .mjs extension

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No authentication token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get PostgreSQL user data
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        // Combine PostgreSQL user data with MongoDB ObjectId
        req.user = {
            ...result.rows[0],
            mongoId: mongoose.Types.ObjectId.isValid(decoded.id) 
                ? decoded.id 
                : mongoose.Types.ObjectId(decoded.id.toString())
        };

        req.token = token;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ success: false, message: 'Please authenticate' });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        next();
    };
};

export default auth;