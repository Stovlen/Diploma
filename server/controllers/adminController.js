const User = require("../models/User");
const Task = require("../models/Task");

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

// GET /api/admin/tasks — всі задачі або фільтровані за email
exports.getAllTasks = async (req, res) => {
  try {
    const { email } = req.query;
    let where = {};

    if (email) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "Користувача не знайдено" });
      }
      where.userId = user.id;
    }

    const tasks = await Task.findAll({
      where,
      include: {
        model: User,
        attributes: ["id", "email", "role"],
      },
    });

    res.json(tasks);
  } catch (err) {
    console.error("Помилка при отриманні задач:", err);
    res.status(500).json({ error: "Не вдалося отримати задачі" });
  }
};

// PUT /api/admin/tasks/:id — редагування задачі
// PUT /api/admin/tasks/:id — редагування задачі
exports.updateTaskByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Оновлюємо лише дозволені поля
    const { title, deadline, status, priority, category } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Задачу не знайдено" });
    }

    // ❗ Не змінюємо userId, щоб автор залишився тим самим
    await task.update({ title, deadline, status, priority, category });

    // Повторно знаходимо з приєднаним користувачем
    const updatedTask = await Task.findByPk(id, {
      include: [{ model: User, attributes: ["email"] }],
    });

    res.json(updatedTask);
  } catch (err) {
    console.error("Помилка при оновленні задачі:", err);
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
