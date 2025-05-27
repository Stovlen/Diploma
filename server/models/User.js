const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user", // "user" або "admin"
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Чоловік", "Жінка"),
    allowNull: true,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetToken: DataTypes.STRING,
  resetTokenExpires: DataTypes.DATE,
});

module.exports = User;
