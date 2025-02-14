const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Helper function to decode and verify the token
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error(`❌ Token verification failed: ${error.message}`);
    throw new Error('Unauthorized. Invalid or expired token.');
  }
};

// Role-based access control middleware
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure req.user is populated
      if (!req.user) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          logger.warn('Unauthorized access attempt: No token provided.');
          return res.status(401).json({ success: false, message: 'Unauthorized. No token found.' });
        }

        // Decode token and attach user info to the request
        req.user = decodeToken(token);
      }

      // Validate user role
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Access denied for user ${req.user.email}. Required roles: ${allowedRoles}. User role: ${req.user.role}`
        );
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have the required role.',
          requiredRoles: allowedRoles,
          userRole: req.user.role,
        });
      }

      next(); // Role is valid, proceed to next middleware
    } catch (error) {
      logger.error(`RoleCheck Middleware Error: ${error.message}`);
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or expired token.' });
    }
  };
};

// Admin check middleware
const adminCheck = (req, res, next) => {
  try {
    // Ensure req.user is populated
    if (!req.user) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        logger.warn('Unauthorized admin access attempt: No token found.');
        return res.status(401).json({ message: 'Unauthorized. No token found.' });
      }

      // Decode token and attach user info to the request
      req.user = decodeToken(token);
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []; // Support multiple admin emails

    if (!adminEmails.includes(req.user.email)) {
      logger.warn(`Forbidden admin access attempt by ${req.user.email}`);
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    next();
  } catch (error) {
    logger.error(`AdminCheck Middleware Error: ${error.message}`);
    return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
  }
};

module.exports = { roleCheck, adminCheck };
