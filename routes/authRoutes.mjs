import express from "express";
import { login, register, logout } from "../controllers/authController.mjs";

const router = express.Router();

console.log("✅ Loading auth routes..."); // 👈 Debug log

router.post("/login", (req, res) => {
  console.log("🛠 Login route hit!"); // 👈 Debug log
  login(req, res);
});
router.post("/register", register);
router.post("/logout", logout);

export default router;
