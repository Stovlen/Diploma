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
     - deadline: дата завершення (ISO-формат, максимум через 7 днів)
     - priority: low / medium / high (оціни важливість по змісту)
  
  📦 Формат відповіді: лише JSON
  {
    "title": "...",
    "description": "...",
    "deadline": "2025-05-25T00:00:00.000Z",
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

    const content = response.data.choices[0].message.content;

    const parsed = JSON.parse(content);

    res.json(parsed);
  } catch (err) {
    console.error(
      "❌ AI генерація задачі помилка:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "AI не зміг згенерувати задачу" });
  }
};