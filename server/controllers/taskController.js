const Task = require("../models/Task");
const User = require("../models/User");

// GET /api/tasks — лише задачі користувача
exports.getAllTasks = async (req, res) => {
  try {
    const filters = { userId: req.user.id };
    if (req.query.category) {
      filters.category = req.query.category;
    }

    const tasks = await Task.findAll({ where: filters });
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
    const { deadline } = req.body;

    // Перевірка дедлайну
    if (deadline && new Date(deadline) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ error: "Дедлайн не може бути в минулому" });
    }

    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Помилка при створенні задачі:", error.message);
    console.error("📄 Повна інформація:", error);
    res.status(400).json({ error: "Не вдалося створити задачу" });
  }
};


// PUT /api/tasks/:id — оновлення задачі
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Задачу не знайдено" });
    }

    // Якщо є deadline — перевіряємо
    if (req.body.deadline) {
      const newDeadline = new Date(req.body.deadline);
      const createdAt = new Date(task.createdAt);

      if (newDeadline < createdAt.setHours(0, 0, 0, 0)) {
        return res
          .status(400)
          .json({ error: "Дедлайн не може бути раніше дати створення задачі" });
      }
    }

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    console.error("❌ Помилка при оновленні задачі:", err.message);
    res.status(500).json({ error: "Не вдалося оновити задачу" });
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
    // Отримуємо задачі користувача
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });

    // Отримуємо користувача
    const user = await User.findByPk(req.user.id, {
      attributes: ["name", "gender", "occupation"],
    });

    const systemPrompt = `
Ти — інтелектуальний асистент з управління задачами. Твоя мета — допомогти користувачу обрати, з яких задач почати, враховуючи:
- дедлайни
- статуси
- пріоритети
- стать користувача
- його рід діяльності

Дані користувача:
- Ім’я: ${user.name || "не вказано"}
- Стать: ${user.gender || "не вказано"}
- Рід діяльності: ${user.occupation || "не вказано"}

На основі всього цього проаналізуй задачі та поверни рекомендацію:
1. Відсортуй задачі від найважливішої до менш важливої
2. Визнач, з чого варто почати і чому
3. За потреби, зверни увагу на прострочені задачі або неефективність

🔁 Формат відповіді:
{
  "sortedTasks": [...],
  "suggestion": "Рекомендація українською мовою (5–7 речень)"
}
    `.trim();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
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

    const parsed = JSON.parse(content);

    res.json(parsed);
  } catch (err) {
    console.error("❌ AI error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI не зміг обробити задачі" });
  }
};

// GET /api/tasks/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });

    const user = await User.findByPk(req.user.id, {
      attributes: ["name", "gender", "occupation"],
    });

    const systemPrompt = `
Ти — аналітик продуктивності. Користувач передав тобі список своїх задач та свій профіль:
- Ім’я: ${user.name || "не вказано"}
- Стать: ${user.gender || "не вказано"}
- Рід діяльності: ${user.occupation || "не вказано"}

🎯 Завдання:
1. Звернись до користувача особисто, враховуючи стать (наприклад, "Олександре", "Оксано").
2. Проаналізуй виконані, прострочені та активні задачі.
3. Виділи найактивніші категорії.
4. Зроби дружню, теплу пораду відповідно до роду діяльності.

📦 Формат відповіді (тільки JSON!):
{
  "summary": "Розгорнута порада (звертаючись до користувача)",
  "metrics": {
    "total": 5,
    "completed": 2,
    "overdue": 1,
    "inProgress": 2,
    "categories": {
      "навчання": 2,
      "побут": 1
    }
  },
    "aiComment": "Короткий коментар про стиль продуктивності користувача"
}
`.trim();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
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

    const parsed = JSON.parse(content); // Парсимо тільки якщо це дійсно JSON

    res.json(parsed);
  } catch (err) {
    console.error("❌ Аналітика AI помилка:", err?.response?.data || err.message);
    res.status(500).json({ error: "Не вдалося отримати аналітику" });
  }
};