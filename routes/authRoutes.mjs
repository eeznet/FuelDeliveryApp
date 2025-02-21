import express from 'express';
import { login, register, logout } from '../controllers/authController.mjs';

const router = express.Router();

// ✅ Correct function names
router.post("/login", login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
