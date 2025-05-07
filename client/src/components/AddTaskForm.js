import React, { useState } from "react";
import axios from "axios";

const AddTaskForm = ({ onTaskAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "not_started", // виправлено
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", form);
      onTaskAdded(res.data); // оновлення списку у TaskList
      setForm({
        title: "",
        description: "",
        priority: "low",
        status: "not_started", // скидання форми
      });
    } catch (err) {
      console.error("Помилка при створенні задачі:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Додати нову задачу</h2>
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
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Низький</option>
        <option value="medium">Середній</option>
        <option value="high">Високий</option>
      </select>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="not_started">Очікує</option> {/* виправлено */}
        <option value="in_progress">У процесі</option>
        <option value="done">Виконано</option>
      </select>
      <button type="submit">Створити</button>
    </form>
  );
};

export default AddTaskForm;
