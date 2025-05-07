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

// Запуск сервера
const PORT = process.env.PORT || 5000;
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const sequelize = require("./config/database");
const Task = require("./models/Task");

sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced successfully");
  })
  .catch((err) => {
    console.error("❌ Failed to sync database:", err);
  });




  