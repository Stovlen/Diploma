import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../utils/authHeaders";

const AdminPage = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filterEmail, setFilterEmail] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/tasks/${id}`,
        editForm,
        { headers: getAuthHeaders() }
      );
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      setEditingTaskId(null);
      toast.success("Задачу оновлено успішно");
    } catch (err) {
      console.error("Помилка при оновленні задачі:", err);
      toast.error("Не вдалося оновити задачу");
    }
  };
  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/${id}`, {
        headers: getAuthHeaders(),
      });      
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success("Задачу успішно видалено");
    } catch (err) {
      console.error("Помилка при видаленні задачі:", err);
      toast.error("Не вдалося видалити задачу");
    }
  };
  

  return (
    <div className="container py-4">
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <h2 className="mb-0 fw-bold">Панель Адміністратора</h2>
      </div>

      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <h4 className="fw-semibold">Користувачі</h4>
        <ul className="list-group mb-0">
          {users.map((user) => (
            <li key={user.id} className="list-group-item">
              {user.email} —{" "}
              <span className="badge bg-secondary text-uppercase">
                {user.role}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <h5 className="fw-semibold mb-3">Фільтрація задач за email</h5>
        <form onSubmit={handleFilterSubmit} className="row g-2">
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
      </div>

      <div className="bg-light p-3 rounded shadow-sm">
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
                  <strong>{task.title}</strong> —{" "}
                  {task.status === "done"
                    ? "Виконано"
                    : task.status === "in_progress"
                    ? "У процесі"
                    : "Очікує"}{" "}
                  —{" "}
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
    </div>
  );
  
};

export default AdminPage;
