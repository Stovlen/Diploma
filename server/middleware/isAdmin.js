// server/middleware/isAdmin.js
module.exports = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // користувач має роль "admin" — дозволяємо доступ
  } else {
    res
      .status(403)
      .json({ error: "Доступ заборонено. Лише для адміністратора." });
  }
};
