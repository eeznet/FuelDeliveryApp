// roleCheck.js
// Middleware to check if the user has a specific role
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated and has a valid role
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not have the required role.',
                requiredRoles: allowedRoles,
                userRole: req.user ? req.user.role : 'None',
            });
        }
        next();
    };
};

module.exports = roleCheck;
