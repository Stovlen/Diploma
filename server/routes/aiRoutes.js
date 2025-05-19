const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleWare");
const {
  getDailyTip,
  generateTaskFromPrompt,
} = require("../controllers/aiController");

router.get("/daily-tip", authMiddleware, getDailyTip);
router.post("/generate-task", authMiddleware, generateTaskFromPrompt);

module.exports = router;
