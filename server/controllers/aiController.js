const axios = require("axios");
const User = require("../models/User");

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
