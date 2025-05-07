import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTaskForm from "./AddTaskForm"; // додано

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні задач:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Помилка при видаленні задачі:", err);
    }
  };


  return (
    <div>
      <AddTaskForm onTaskAdded={() => fetchTasks()} />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status}
            <button onClick={() => handleDelete(task.id)}>Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
