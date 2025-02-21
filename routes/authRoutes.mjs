import express from 'express';
import { login, register, logout } from '../controllers/authController.mjs';

const router = express.Router();

// These will be prefixed with /api/auth
router.post("/login", loginController);       // becomes /api/auth/login
router.post('/register', register); // becomes /api/auth/register
router.post('/logout', logout);     // becomes /api/auth/logout

export default router;