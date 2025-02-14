import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import logger from "../config/logger.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const result = await pool.query(
            'SELECT id, name, email, role, is_active FROM users WHERE id = $1',
            [decoded.id]
        );
        
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is disabled'
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        logger.error(`Auth middleware error: ${error.message}`);
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Role-based middleware
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