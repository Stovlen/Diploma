// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../utils/authHeaders";

const AdminPage = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filterEmail, setFilterEmail] = useState("");
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
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status} — Автор:{" "}
            {task.User?.email || "Невідомо"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
