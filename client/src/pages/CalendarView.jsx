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
    const selectedDateStr = date.toLocaleDateString("uk-UA");

    const filtered = tasks.filter((task) => {
      if (!task.deadline) return false;
      const deadlineStr = new Date(task.deadline).toLocaleDateString("uk-UA");
      return deadlineStr === selectedDateStr;
    });

    setSelectedDateTasks(filtered);
  };
  

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📅 Календар задач</h2>

      <div className="d-flex justify-content-center mb-4">
        <div className="bg-light p-3 border rounded">
          <Calendar onClickDay={onDateClick} locale="uk-UA" />
        </div>
      </div>

      {selectedDateTasks.length > 0 ? (
        <>
          <h5 className="mb-3">Задачі на обрану дату:</h5>
          <div className="row g-3">
            {selectedDateTasks.map((task) => (
              <div className="col-md-6" key={task.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{task.title}</h5>
                    <p className="card-text mb-1">
                      <strong>Статус:</strong>{" "}
                      <span className="text-muted">{task.status}</span>
                    </p>
                    {task.priority && (
                      <p className="card-text mb-1">
                        <strong>Пріоритет:</strong> {task.priority}
                      </p>
                    )}
                    {task.category && (
                      <p className="card-text mb-1">
                        <strong>Категорія:</strong> {task.category}
                      </p>
                    )}
                    {task.description && (
                      <p className="card-text">
                        <em>{task.description}</em>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert-info text-center">
          Оберіть дату, щоб переглянути задачі.
        </div>
      )}
    </div>
  );
};

export default CalendarView;
