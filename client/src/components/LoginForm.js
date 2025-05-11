import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      const { token } = res.data;
      localStorage.setItem("token", token);
      onLogin(); // повідомляємо батьківський компонент
    } catch (err) {
      console.error(err);
      setError("Невірний email або пароль");
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
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Увійти</button>
    </form>
  );
};

export default LoginForm;
