import express from 'express';
import { login, register, logout } from '../controllers/authController.mjs';

const router = express.Router();

// These will be prefixed with /api/auth
router.post("/login", login);       // ✅ Fixed function name
router.post("/register", register);
router.post("/logout", logout);

export default router;
