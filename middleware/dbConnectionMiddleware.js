// middleware/dbConnectionMiddleware.js
import logger from '../config/logger';

const dbConnectionMiddleware = (req, res, next) => {
  // Simulating a DB check (in real-world, use actual DB connection logic)
  const isDbConnected = true; // Replace this with your actual DB connection check

  if (!isDbConnected) {
    logger.error('❌ Database connection failed');
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  next();
};

export default dbConnectionMiddleware;
