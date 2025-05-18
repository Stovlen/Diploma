import React, { useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const AddTaskForm = ({ onTaskAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "low",
    status: "not_started",
    category: "", // 🆕 нове поле
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Назва обов'язкова");
      return;
    }

    if (form.title.length > 100) {
      setError("Назва не може містити більше 100 символів");
      return;
    }

    setError("");

    const preparedForm = {
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        preparedForm,
        {
          headers: getAuthHeaders(),
        }
      );
      onTaskAdded(response.data);
      setForm({
        title: "",
        description: "",
        deadline: "",
        priority: "low",
        status: "not_started",
        category: "", // 🧹 очищаємо після сабміту
      });
    } catch (err) {
      console.error("Помилка при створенні задачі:", err);
      setError("Не вдалося створити задачу");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Додати нову задачу</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="title"
        placeholder="Назва"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Опис"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
      />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Низький</option>
        <option value="medium">Середній</option>
        <option value="high">Високий</option>
      </select>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="not_started">Очікує</option>
        <option value="in_progress">У процесі</option>
        <option value="done">Виконано</option>
      </select>

      <input
        type="text"
        name="category"
        placeholder="Категорія (опціонально)"
        value={form.category}
        onChange={handleChange}
      />

      <button type="submit">Створити</button>
    </form>
  );
};

export default AddTaskForm;
