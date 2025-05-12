// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../utils/authHeaders";

const AdminPage = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filterEmail, setFilterEmail] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: getAuthHeaders(),
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні користувачів:", err);
    }
  };

  const fetchTasks = async (email = "") => {
    try {
      const url = email
        ? `http://localhost:5000/api/admin/tasks?email=${email}`
        : "http://localhost:5000/api/admin/tasks";

      const res = await axios.get(url, {
        headers: getAuthHeaders(),
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні задач:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilterEmail(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTasks(filterEmail);
  };

  const handleClearFilter = () => {
    setFilterEmail("");
    fetchTasks();
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (taskId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/tasks/${taskId}`,
        editForm,
        { headers: getAuthHeaders() }
      );
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error("Помилка при оновленні задачі:", err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Ви впевнені, що хочете видалити задачу?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/${taskId}`, {
        headers: getAuthHeaders(),
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Помилка при видаленні задачі:", err);
    }
  };

  return (
    <div>
      <button onClick={handleLogoutClick}>Вийти</button>
      <h2>Панель Адміністратора</h2>

      <h3>Користувачі</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email} — {user.role}
          </li>
        ))}
      </ul>

      <h3>Фільтрація задач за email</h3>
      <form onSubmit={handleFilterSubmit}>
        <input
          type="text"
          placeholder="user@example.com"
          value={filterEmail}
          onChange={handleFilterChange}
        />
        <button type="submit">Фільтрувати</button>
        <button type="button" onClick={handleClearFilter}>
          Очистити фільтр
        </button>
      </form>

      <h3>Усі задачі</h3>
      <ul>
        {tasks.map((task) =>
          editingTaskId === task.id ? (
            <li key={task.id}>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
              />
              <input
                name="deadline"
                type="date"
                value={editForm.deadline}
                onChange={handleEditChange}
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                <option value="not_started">Очікує</option>
                <option value="in_progress">У процесі</option>
                <option value="done">Виконано</option>
              </select>
              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
              >
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
              <button onClick={() => saveEdit(task.id)}>Зберегти</button>
              <button onClick={() => setEditingTaskId(null)}>Скасувати</button>
            </li>
          ) : (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.status} — Автор:{" "}
              {task.User?.email || "Невідомо"}{" "}
              <button onClick={() => startEdit(task)}>Редагувати</button>
              <button onClick={() => deleteTask(task.id)}>Видалити</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default AdminPage;
