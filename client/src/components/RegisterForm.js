import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onRegister }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валідація
    if (!form.email || !form.password || !form.confirmPassword) {
      return setError("Всі поля обов'язкові");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Паролі не збігаються");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        email: form.email,
        password: form.password,
      });
      // Автоматично викликаємо вхід
      onRegister(res.data.token);
    } catch (err) {
      console.error("Помилка при реєстрації:", err);
      setError("Не вдалося зареєструватися");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    
      {error && <p style={{ color: "red" }}>{error}</p>}

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
  );
};

export default RegisterForm;
