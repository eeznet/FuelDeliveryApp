import express from 'express';
import { login, register, logout } from '../controllers/authController.mjs';
import { auth } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', auth, logout);

export default router;