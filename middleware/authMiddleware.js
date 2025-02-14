import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import logger from "../config/logger.js";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Account disabled'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
    } catch (error) {
        logger.error(`Auth middleware error: ${error.message}`);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
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