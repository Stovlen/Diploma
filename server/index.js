// Підключення залежностей
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Ініціалізація
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Тестовий маршрут
app.get("/", (req, res) => {
  res.send("TaskMaster backend is working!");
});

// Підключення до бази даних
const sequelize = require("./config/database");
const Task = require("./models/Task");
const User = require("./models/User");

// Визначення зв’язків між моделями
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

// Синхронізація з базою
sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced successfully");
  })
  .catch((err) => {
    console.error("❌ Failed to sync database:", err);
  });

// Підключення маршрутів
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes"); // перенесено сюди

app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes); // ✅ тепер app вже ініціалізовано

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
