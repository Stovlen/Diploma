const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleWare");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/adminController");

// захищений маршрут для отримання списку всіх користувачів
router.get("/users", authMiddleware, isAdmin, adminController.getAllUsers);

router.get("/tasks", authMiddleware, isAdmin, adminController.getAllTasks);

router.put(
  "/tasks/:id",
  authMiddleware,
  isAdmin,
  adminController.updateTaskByAdmin
);
router.delete(
  "/tasks/:id",
  authMiddleware,
  isAdmin,
  adminController.deleteTaskByAdmin
);



module.exports = router;
