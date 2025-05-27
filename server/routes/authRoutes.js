const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
// routes/authRoutes.js
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);


const authMiddleware = require("../middleware/authMiddleWare");

router.get("/profile", authMiddleware, authController.getProfile);

// 🆕 Додаємо оновлення профілю:
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
