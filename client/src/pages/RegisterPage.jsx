import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    occupation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Паролі не співпадають");
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Помилка реєстрації");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Серверна помилка");
    }
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Ім'я"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="occupation"
          placeholder="Рід діяльності"
          value={form.occupation}
          onChange={handleChange}
        />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Оберіть стать</option>
          <option value="Чоловік">Чоловік</option>
          <option value="Жінка">Жінка</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Підтвердити пароль"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Зареєструватися</button>
      </form>
      <p>
        Уже є акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
