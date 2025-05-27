const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");

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
      role: role || "user",
    });

    // ✅ Надсилаємо підтвердження на пошту
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TaskMaster" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Вітаємо в TaskMaster!",
      html: `
        <h3>Вітаємо, ${user.name || "користувачу"}!</h3>
        <p>Ви успішно зареєструвались у <strong>TaskMaster</strong>.</p>
        <p>Успіхів у керуванні вашими задачами!</p>
      `,
    });

    console.log(`✅ Email надіслано користувачу ${user.email}`);

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
    console.error("❌ Помилка при реєстрації:", err);
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

// PUT /api/profile — оновлення тільки роду діяльності
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const { occupation } = req.body;

    await user.update({ occupation });

    res.json({
      message: "Профіль оновлено",
      user: {
        id: user.id,
        name: user.name,
        gender: user.gender,
        occupation: user.occupation,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Помилка при оновленні профілю:", err);
    res.status(500).json({ error: "Не вдалося оновити профіль" });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

  const token = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 год

  await user.update({ resetToken: token, resetTokenExpires });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  try {
    const info = await transporter.sendMail({
      from: '"TaskMaster" <noreply@taskmaster.com>',
      to: user.email,
      subject: "Скидання пароля",
      html: `<p>Натисніть <a href="${resetUrl}">тут</a>, щоб скинути пароль.</p>`,
    });

    console.log("📧 Лист для скидання пароля надіслано:", info.response);
    res.json({ message: "Інструкції надіслано на email" });
  } catch (error) {
    console.error("❌ Помилка надсилання email:", error);
    res.status(500).json({ error: "Не вдалося надіслати листа" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user)
    return res.status(400).json({ error: "Недійсний або прострочений токен" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  });

  res.json({ message: "Пароль успішно оновлено" });
};
