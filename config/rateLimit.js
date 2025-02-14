import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

// Load rate limit settings from environment variables or use defaults
const windowMs = process.env.RATE_LIMIT_WINDOW_MS
  ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
  : 15 * 60 * 1000; // Default: 15 minutes

const maxRequests = process.env.RATE_LIMIT_MAX
  ? parseInt(process.env.RATE_LIMIT_MAX)
  : 100; // Default: 100 requests per window

const limiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  headers: true, // Include rate limit headers in responses
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: IP ${req.ip} - ${req.method} ${req.originalUrl}`);

    res.set("Retry-After", Math.ceil(windowMs / 1000)); // Inform client how long to wait
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
    });
  },
});

export default limiter;
