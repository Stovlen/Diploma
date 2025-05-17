import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onRegister }) => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    occupation: "",
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

    if (
      !form.name ||
      !form.gender ||
      !form.occupation ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return setError("Всі поля обов'язкові");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Паролі не збігаються");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name: form.name,
        gender: form.gender,
        occupation: form.occupation,
        email: form.email,
        password: form.password,
      });

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
        <option value="male">Чоловік</option>
        <option value="female">Жінка</option>
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
  );
};

export default RegisterForm;
