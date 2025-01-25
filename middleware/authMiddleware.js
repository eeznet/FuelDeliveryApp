const jwt = require('jsonwebtoken');

// Middleware to handle token verification and role-based access control
const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    // Check for token in the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }

    try {
      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data to the request object

      // If roles are specified, check for role-based access control
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access forbidden: insufficient role',
          requiredRoles: roles,
          userRole: req.user.role,
        });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error in authMiddleware:', error);

      // Differentiating the error types
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Server error, unable to verify token',
        });
      }
    }
  };
};

module.exports = authMiddleware;
