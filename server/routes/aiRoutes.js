const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleWare");
const { getDailyTip } = require("../controllers/aiController");

router.get("/daily-tip", authMiddleware, getDailyTip);

module.exports = router;
