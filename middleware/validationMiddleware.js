const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

// Common validation handler
const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.param}: ${err.msg}`);
    logger.error(`Validation Error: ${JSON.stringify(errorMessages)}`);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  next();
};

// User Registration Validation
const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must be under 100 characters'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain at least one special character (@$!%*?&)'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  validateFields, // Calls the validation handler
];

module.exports = { validateRegistration };
