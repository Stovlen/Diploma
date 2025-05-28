const axios = require("axios");
const User = require("../models/User");
const Task = require("../models/Task");

exports.getDailyTip = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["name", "gender", "occupation"],
    });

    const systemPrompt = `
Ти — доброзичливий асистент, який щодня мотивує користувача почати день продуктивно.

Інформація про користувача:
- Ім’я: ${user.name || "не вказано"}
- Стать: ${user.gender || "не вказано"}
- Рід діяльності: ${user.occupation || "не вказано"}

📌 Завдання: напиши коротку пораду (1-2 речення), як найкраще розпочати день з урахуванням діяльності користувача. Наприклад:
- “Олександре, почни день із пріоритетних задач. Сконцентруйся на навчанні.”
- “Пані Оксано, 30 хвилин тиші з кавою допоможуть налаштуватись на робочий ритм.”

📦 Формат:
{ "tip": "Твоя порада українською мовою" }
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
    console.error("❌ AI Tip Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Не вдалося отримати пораду від ШІ" });
  }
};

exports.generateTaskFromPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Опис обов’язковий" });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["name", "gender", "occupation"],
    });

    const systemPrompt = `
Ти — асистент з управління завданнями. Користувач вводить опис бажаної активності (наприклад, "підготуватись до іспиту", "прибрати вдома").

🎯 Завдання:
1. Проаналізуй опис.
2. Сформуй задачу у вигляді:
   - title: коротка назва
   - description: уточнення, що саме потрібно зробити
   - priority: low / medium / high (оціни важливість по змісту)

❗ Не вказуй дедлайн. Його встановить система автоматично.

📦 Формат відповіді: лише JSON
{
  "title": "...",
  "description": "...",
  "priority": "medium"
}

🔍 Контекст користувача:
- Ім’я: ${user.name || "не вказано"}
- Стать: ${user.gender || "не вказано"}
- Рід діяльності: ${user.occupation || "не вказано"}
    `.trim();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const parsed = JSON.parse(response.data.choices[0].message.content);

    // Поточна дата у форматі ISO
    const today = new Date().toISOString().split("T")[0];

    const createdTask = await Task.create({
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority,
      deadline: today,
      status: "not_started",
      userId: req.user.id,
    });

    res.status(201).json(createdTask);
  } catch (err) {
    console.error(
      "❌ AI генерація задачі помилка:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "AI не зміг згенерувати задачу" });
  }
};

exports.analyzeHabits = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["name", "gender", "occupation"],
    });

    const allTasks = await Task.findAll({ where: { userId } });

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const completedTasks = allTasks.filter((t) => t.status === "done");
    const overdueTasks = allTasks.filter(
      (t) => t.deadline && new Date(t.deadline) < now && t.status !== "done"
    );

    const recentCompleted = completedTasks.filter(
      (t) => new Date(t.updatedAt) >= weekAgo
    );

    const priorityCount = {
      low: completedTasks.filter((t) => t.priority === "low").length,
      medium: completedTasks.filter((t) => t.priority === "medium").length,
      high: completedTasks.filter((t) => t.priority === "high").length,
    };

    const categories = {};
    completedTasks.forEach((task) => {
      if (task.category) {
        categories[task.category] = (categories[task.category] || 0) + 1;
      }
    });

    const systemPrompt = `
Ти — аналітик продуктивності користувача. Оціни звички користувача за такими параметрами:

1. Кількість виконаних задач: ${completedTasks.length}
2. Прострочені задачі: ${overdueTasks.length}
3. Завдань виконано за останній тиждень: ${recentCompleted.length}
4. Розподіл по пріоритетах:
   - Low: ${priorityCount.low}
   - Medium: ${priorityCount.medium}
   - High: ${priorityCount.high}
5. Найпопулярніші категорії: ${
      Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat, count]) => `${cat} (${count})`)
        .join(", ") || "немає"
    }

🧠 Задача:
Зроби аналіз у вигляді 2-3 абзаців українською мовою. Дай поради, як покращити продуктивність. Уникай повторів.

Користувач:
- Ім’я: ${user.name || "не вказано"}
- Стать: ${user.gender || "не вказано"}
- Діяльність: ${user.occupation || "не вказано"}

📦 Формат:
{ "insight": "..." }
`.trim();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const parsed = JSON.parse(response.data.choices[0].message.content);
    res.json(parsed);
  } catch (err) {
    console.error(
      "❌ Habit Analysis Error:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "Не вдалося провести аналіз звичок" });
  }
};