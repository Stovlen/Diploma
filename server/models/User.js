const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Task = require("./Task"); // додаємо зв'язок

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// 🔗 Додаємо асоціації
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

module.exports = User;
