const User = require("../models/User");

// GET /api/admin/users — отримати список усіх користувачів
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    console.error("Помилка при отриманні користувачів:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

const Task = require("../models/Task");
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: {
        model: User,
        attributes: ["id", "email", "role"],
      },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося отримати задачі" });
  }
};