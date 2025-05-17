const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

// Генерація JWT токена
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// POST /api/register
exports.register = async (req, res) => {
  const { email, password, name, gender, occupation, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || "Адмін",
      gender: gender || null,
      occupation: occupation || null,
      role: role || "user", // ← дозволяємо передати 'admin'
    });

    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        gender: user.gender,
        occupation: user.occupation,
      },
      token,
    });
  } catch (err) {
    console.error("Помилка при реєстрації:", err);
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        gender: user.gender,
        occupation: user.occupation,
      },
      token,
    });
  } catch (err) {
    console.error("Помилка при вході:", err);
    res.status(500).json({ error: "Помилка при вході" });
  }
};

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "email",
        "name",
        "role",
        "gender",
        "occupation",
        "createdAt",
      ],
    });
    res.json(user);
  } catch (err) {
    console.error("Помилка при отриманні профілю:", err);
    res.status(500).json({ error: "Не вдалося отримати профіль" });
  }
};
