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

// PUT /api/admin/tasks/:id — редагування задачі
exports.updateTaskByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Task.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ error: "Задачу не знайдено" });
    }

    const updatedTask = await Task.findByPk(id);
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося оновити задачу" });
  }
};

// DELETE /api/admin/tasks/:id — видалення задачі
exports.deleteTaskByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ error: "Задачу не знайдено" });
    }

    res.json({ message: "Задачу видалено" });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося видалити задачу" });
  }
};
