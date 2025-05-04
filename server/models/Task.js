const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  deadline: DataTypes.DATE,
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium",
  },
  status: {
    type: DataTypes.ENUM("not_started", "in_progress", "done"),
    defaultValue: "not_started",
  },
});

module.exports = Task;
