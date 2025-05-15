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

const axios = require("axios");

exports.getTaskSuggestions = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // або залишити "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: `
Ти асистент з управління завданнями. Користувач передав тобі список своїх задач (із дедлайнами, статусами та пріоритетами).

Твоя мета:
1. Проаналізувати задачі.
2. Пояснити користувачу, з чого варто почати і чому.
3. Звернути увагу на прострочені або забуті задачі.
4. Зробити висновки про продуктивність (наприклад, якщо багато задач не виконано або з низьким пріоритетом).

🔁 Відповідь поверни у форматі JSON з полями:
- "sortedTasks": відсортований масив задач
- "suggestion": детальна порада (5–7 речень), у дружньому тоні українською
            `.trim(),
          },
          {
            role: "user",
            content: JSON.stringify(tasks),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const parsed = JSON.parse(content); // Парсимо відповідь GPT

    res.json(parsed);
  } catch (err) {
    console.error("❌ AI error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI не зміг обробити задачі" });
  }
};

