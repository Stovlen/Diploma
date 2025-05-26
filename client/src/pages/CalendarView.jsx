import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", { headers: getAuthHeaders() })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Не вдалося завантажити задачі:", err));
  }, []);

  const onDateClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const filtered = tasks.filter(
      (task) => task.deadline?.split("T")[0] === dateStr
    );
    setSelectedDateTasks(filtered);
  };

  return (
    <div>
      <h2>Календар задач</h2>
      <Calendar onClickDay={onDateClick} locale="en-US" />
      <ul>
        {selectedDateTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
