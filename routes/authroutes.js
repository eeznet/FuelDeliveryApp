import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', auth, logout);

export default router;
