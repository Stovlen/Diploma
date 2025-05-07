import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTaskForm from "./AddTaskForm"; // не забудь перевірити правильний шлях

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  return (
    <>
      <AddTaskForm onTaskAdded={handleTaskAdded} />

      <ul>
        {tasks.map((task) =>
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
              <button onClick={saveEdit}>Зберегти</button>
            </li>
          ) : (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.status}
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
