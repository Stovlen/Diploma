const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleWare");
const {
  getDailyTip,
  generateTaskFromPrompt,
  analyzeHabits, // 🧠 додали тут
} = require("../controllers/aiController"); // 🧠 контролер

router.get("/daily-tip", authMiddleware, getDailyTip);
router.post("/generate-task", authMiddleware, generateTaskFromPrompt);
router.get("/analyze-habits", authMiddleware, analyzeHabits); // 🧠 Шлях

module.exports = router;
