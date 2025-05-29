import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddTaskForm from "./AddTaskForm";
import { getAuthHeaders } from "../utils/authHeaders";
import GenerateTaskForm from "./GenerateTaskForm"; // 🟢 Додано імпорт

const translateStatus = (status) => {
  switch (status) {
    case "not_started":
      return "Очікує";
    case "in_progress":
      return "У процесі";
    case "done":
      return "Виконано";
    default:
      return status;
  }
};

const translatePriority = (priority) => {
  switch (priority) {
    case "low":
      return "Низький";
    case "medium":
      return "Середній";
    case "high":
      return "Високий";
    default:
      return priority;
  }
};


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [reminders, setReminders] = useState([]);

  // ✅ додай сюди:
  const [showForm, setShowForm] = useState(false);

  const [showGenerator, setShowGenerator] = useState(false);


  useEffect(() => {
    const fetchTasks = () => {
      axios
        .get("http://localhost:5000/api/tasks", {
          headers: getAuthHeaders(),
        })
        .then((res) => {
          setTasks(res.data);
          checkReminders(res.data);
        })
        .catch((err) => console.error("Помилка при завантаженні задач:", err));
    };

    fetchTasks();
  }, []);

  const checkReminders = (taskList) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const filtered = taskList.filter((task) => {
      if (!task.deadline || task.status === "done") return false;

      const deadlineDate = new Date(task.deadline);
      const isToday = deadlineDate.toDateString() === today.toDateString();
      const isTomorrow =
        deadlineDate.toDateString() === tomorrow.toDateString();

      return isToday || isTomorrow;
    });

    setReminders(filtered);
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: getAuthHeaders(),
      })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.success("Задачу успішно видалено");
      })
      .catch((err) => console.error("Помилка при видаленні задачі:", err));
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({ ...task, deadline: task.deadline?.split("T")[0] || "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    axios
      .put(`http://localhost:5000/api/tasks/${editingTask}`, editForm, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
  setTasks(tasks.map((t) => (t.id === editingTask ? res.data : t)));
  setEditingTask(null);
  toast.success("Задачу оновлено");
})

      .catch((err) => console.error("Помилка при оновленні задачі:", err));
  };

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];

  const filteredTasks = tasks
    .filter((task) =>
      filterStatus === "all" ? true : task.status === filterStatus
    )
    .filter((task) =>
      filterPriority === "all" ? true : task.priority === filterPriority
    )
    .filter((task) =>
      filterCategory === "all" ? true : task.category === filterCategory
    );

  return (
    <div className="mt-4">
      {/* Кнопка для показу/приховування */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Сховати форму" : "➕ Додати задачу"}
      </button>

      {/* Форма додавання задачі */}
      <div className={`slide-down ${showForm ? "show" : ""}`}>
        <AddTaskForm onTaskAdded={handleTaskAdded} />
      </div>

      <button
        className="btn btn-info mb-3"
        onClick={() => setShowGenerator(!showGenerator)}
      >
        {showGenerator ? "Сховати генератор" : "🧠 Згенерувати задачу"}
      </button>

      <div className={`slide-down ${showGenerator ? "show" : ""}`}>
        <GenerateTaskForm onTaskGenerated={handleTaskAdded} />
      </div>

      <div className="p-3 rounded bg-white shadow-sm mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label fw-bold text-dark">
              Фільтр за статусом
            </label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Усі</option>
              <option value="not_started">Очікує</option>
              <option value="in_progress">У процесі</option>
              <option value="done">Виконано</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold text-dark">
              Фільтр за пріоритетом
            </label>
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Усі</option>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold text-dark">
              Фільтр за категорією
            </label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Усі</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {reminders.length > 0 && (
        <div className="alert alert-warning" role="alert">
          <strong>Нагадування:</strong> У вас {reminders.length} задач
          {reminders.length === 1 ? "а" : "і"} з дедлайном сьогодні або завтра.
        </div>
      )}
      <ul className="list-group">
        {filteredTasks.map((task) =>
          editingTask === task.id ? (
            <li key={task.id} className="list-group-item">
              <div className="row g-2 align-items-center">
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
                    value={editForm.deadline || ""}
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
                <div className="col-md-2">
                  <input
                    name="category"
                    className="form-control"
                    placeholder="Категорія"
                    value={editForm.category || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-1 d-grid gap-2">
                  <button className="btn btn-success btn-sm" onClick={saveEdit}>
                    Зберегти
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <li
              key={task.id}
              className={`list-group-item ${
                task.deadline &&
                new Date(task.deadline) < new Date() &&
                task.status !== "done"
                  ? "text-danger"
                  : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{task.title}</h5>
                  <p className="mb-1">
                    <em>Опис:</em> {task.description} <br />
                    <em>Статус:</em> {translateStatus(task.status)} <br />
                    <em>Пріоритет:</em> {translatePriority(task.priority)}{" "}
                    <br />
                    {task.category && (
                      <>
                        <em>Категорія:</em> {task.category} <br />
                      </>
                    )}
                    <em>Створено:</em>{" "}
                    {new Date(task.createdAt).toLocaleDateString("uk-UA")}{" "}
                    <br />
                    {task.deadline && (
                      <>
                        <em>Дедлайн:</em>{" "}
                        {new Date(task.deadline).toLocaleDateString("uk-UA")}
                      </>
                    )}
                  </p>
                </div>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => startEdit(task)}
                  >
                    Редагувати
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default TaskList;
