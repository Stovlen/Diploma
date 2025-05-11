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
