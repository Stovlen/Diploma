const Task = require("../models/Task");

// GET /api/tasks — лише задачі користувача
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося отримати задачі" });
  }
};

// GET /api/tasks/:id — конкретна задача, якщо вона належить користувачу
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Задачу не знайдено" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні задачі" });
  }
};

// POST /api/tasks — створення задачі з userId
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Помилка при створенні задачі:", error.message);
    console.error("📄 Повна інформація:", error);
    res.status(400).json({ error: "Не вдалося створити задачу" });
  }
};


// PUT /api/tasks/:id — оновлення лише своїх задач
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Задачу не знайдено" });

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: "Не вдалося оновити задачу" });
  }
};

// DELETE /api/tasks/:id — видалення лише своїх задач
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Задачу не знайдено" });
    }
    res.json({ message: "Задачу видалено" });
  } catch (error) {
    res.status(500).json({ error: "Не вдалося видалити задачу" });
  }
};
