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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Панель Адміністратора</h2>
        <button onClick={handleLogoutClick} className="btn btn-danger">
          Вийти
        </button>
      </div>

      <h4>Користувачі</h4>
      <ul className="list-group mb-4">
        {users.map((user) => (
          <li key={user.id} className="list-group-item">
            {user.email} —{" "}
            <span className="badge bg-secondary text-uppercase">
              {user.role}
            </span>
          </li>
        ))}
      </ul>

      <h4>Фільтрація задач за email</h4>
      <form onSubmit={handleFilterSubmit} className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="user@example.com"
            value={filterEmail}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Фільтрувати
          </button>
        </div>
        <div className="col-auto">
          <button
            type="button"
            onClick={handleClearFilter}
            className="btn btn-secondary"
          >
            Очистити
          </button>
        </div>
      </form>

      <h4>Усі задачі</h4>
      <ul className="list-group">
        {tasks.map((task) =>
          editingTaskId === task.id ? (
            <li key={task.id} className="list-group-item">
              <div className="row g-2">
                <div className="col-md-3">
                  <input
                    name="title"
                    className="form-control"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    name="deadline"
                    type="date"
                    className="form-control"
                    value={editForm.deadline}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-2">
                  <select
                    name="status"
                    className="form-select"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <option value="not_started">Очікує</option>
                    <option value="in_progress">У процесі</option>
                    <option value="done">Виконано</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select
                    name="priority"
                    className="form-select"
                    value={editForm.priority}
                    onChange={handleEditChange}
                  >
                    <option value="low">Низький</option>
                    <option value="medium">Середній</option>
                    <option value="high">Високий</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => saveEdit(task.id)}
                  >
                    Зберегти
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setEditingTaskId(null)}
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{task.title}</strong> — {task.status} —{" "}
                <small className="text-muted">
                  Автор: {task.User?.email || "Невідомо"}
                </small>
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => startEdit(task)}
                >
                  Редагувати
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Видалити
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default AdminPage;
