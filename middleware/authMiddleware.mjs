import jwt from 'jsonwebtoken';
import pool from '../config/database.mjs';  // Note the .mjs extension

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No authentication token' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        
        if (result.rows.length === 0) {
            throw new Error();
        }

        req.token = token;
        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Please authenticate' 
        });
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