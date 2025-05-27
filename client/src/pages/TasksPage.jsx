import React from "react";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";

const TasksPage = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">📋 Задачі</h1>
        <button onClick={onLogout} className="btn btn-outline-danger">
          Вийти
        </button>
      </div>

      <div className="btn-group mb-4" role="group">
        <button
          onClick={() => navigate("/tips")}
          className="btn btn-outline-primary"
        >
          ШІ поради
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-outline-primary"
        >
          Статистика
        </button>
        <button
          onClick={() => navigate("/calendar")}
          className="btn btn-outline-primary"
        >
          Календар
        </button>
      </div>

      <TaskList />
    </div>
  );
};

export default TasksPage;
