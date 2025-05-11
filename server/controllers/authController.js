const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

// Генерація JWT токена
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // додано role
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// POST /api/register
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = generateToken(user);
    res.status(201).json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Помилка при реєстрації" });
  }
};

// POST /api/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Невірні дані" });
    }

    const token = generateToken(user);
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Помилка при вході" });
  }
};
