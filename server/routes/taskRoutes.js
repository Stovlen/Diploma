const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleWare");

router.use(authMiddleware); // захищаємо всі маршрути

// 🔥 ВАЖЛИВО — цей маршрут має бути ПЕРШИМ до /:id
router.get("/suggestions", taskController.getTaskSuggestions);
router.get("/analytics", authMiddleware, taskController.getAnalytics);


router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
