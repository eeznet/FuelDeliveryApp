// middleware/rateLimitMiddleware.js
import rateLimit from 'express-rate-limit';
import logger from '../config/logger';

// Define the rate limiting rules (e.g., max 100 requests per hour)
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after an hour.',
  onLimitReached: (req, res, options) => {
    logger.warn(`Rate limit exceeded for ${req.ip}`);
  },
});

export default rateLimiter;
