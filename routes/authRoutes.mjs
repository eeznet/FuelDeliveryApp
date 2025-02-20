import express from 'express';
import { login, register, logout } from '../controllers/authController.mjs';

const router = express.Router();

// Auth routes - these will be prefixed with /api/auth
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;