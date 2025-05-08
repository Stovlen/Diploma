import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTaskForm from "./AddTaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Помилка при завантаженні задач:", err));
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((err) => console.error("Помилка при видаленні задачі:", err));
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditForm(task);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    axios
      .put(`http://localhost:5000/api/tasks/${editingTask}`, editForm)
      .then((res) => {
        setTasks(tasks.map((t) => (t.id === editingTask ? res.data : t)));
        setEditingTask(null);
      })
      .catch((err) => console.error("Помилка при оновленні задачі:", err));
  };

  const toggleTaskStatus = (task) => {
    const updatedStatus = task.status === "done" ? "not_started" : "done";
    axios
      .put(`http://localhost:5000/api/tasks/${task.id}`, {
        ...task,
        status: updatedStatus,
      })
      .then((res) => {
        setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
      })
      .catch((err) =>
        console.error("Помилка при зміні статусу виконання:", err)
      );
  };

  const filteredTasks = tasks
    .filter((task) =>
      filterStatus === "all" ? true : task.status === filterStatus
    )
    .filter((task) =>
      filterPriority === "all" ? true : task.priority === filterPriority
    );

  return (
    <>
      <AddTaskForm onTaskAdded={handleTaskAdded} />

      <label>
        Фільтр за статусом:{" "}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Усі</option>
          <option value="not_started">Очікує</option>
          <option value="in_progress">У процесі</option>
          <option value="done">Виконано</option>
        </select>
      </label>

      <label>
        {" "}
        Фільтр за пріоритетом:{" "}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">Усі</option>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </label>

      <ul>
        {filteredTasks.map((task) =>
          editingTask === task.id ? (
            <li key={task.id}>
              <input
                name="title"
                value={editForm.title}
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
              <input
                type="date"
                name="deadline"
                value={editForm.deadline?.split("T")[0] || ""}
                onChange={handleEditChange}
              />
              <button onClick={saveEdit}>Зберегти</button>
            </li>
          ) : (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.status === "done"}
                onChange={() => toggleTaskStatus(task)}
              />
              <strong>{task.title}</strong> — {task.status}
              <br />
              <em>Опис:</em> {task.description}
              <br />
              <em>Пріоритет:</em> {task.priority}
              <br />
              {task.deadline && (
                <em>
                  Дедлайн: {new Date(task.deadline).toLocaleDateString("uk-UA")}
                </em>
              )}
              <br />
              <em>Створено:</em>{" "}
              {new Date(task.createdAt).toLocaleDateString("uk-UA")}
              <br />
              <button onClick={() => startEdit(task)}>Редагувати</button>
              <button onClick={() => deleteTask(task.id)}>Видалити</button>
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default TaskList;
