import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../utils/authHeaders";

const AddTaskForm = ({ onTaskAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "low",
    status: "not_started",
    category: "",
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
        { headers: getAuthHeaders() }
      );

      onTaskAdded(response.data);
      toast.success("✅ Задачу додано успішно!");

      setForm({
        title: "",
        description: "",
        deadline: "",
        priority: "low",
        status: "not_started",
        category: "",
      });
    } catch (err) {
      console.error("Помилка при створенні задачі:", err);
      setError("Не вдалося створити задачу");
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light border rounded">
      <h4 className="mb-3">Додати нову задачу</h4>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Назва</label>
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="Напр. Купити молоко"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Опис</label>
        <input
          type="text"
          name="description"
          className="form-control"
          placeholder="Короткий опис"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Дедлайн</label>
        <input
          type="date"
          name="deadline"
          className="form-control"
          min={new Date().toISOString().split("T")[0]} // мінімальна дата — сьогодні
          value={form.deadline}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Пріоритет</label>
        <select
          name="priority"
          className="form-select"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Статус</label>
        <select
          name="status"
          className="form-select"
          value={form.status}
          onChange={handleChange}
        >
          <option value="not_started">Очікує</option>
          <option value="in_progress">У процесі</option>
          <option value="done">Виконано</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Категорія (опціонально)</label>
        <input
          type="text"
          name="category"
          className="form-control"
          placeholder="Напр. Робота, Навчання"
          value={form.category}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-success w-100">
        Створити задачу
      </button>
    </form>
  );
};

export default AddTaskForm;
