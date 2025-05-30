import React from "react";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";

const TasksPage = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="p-3 bg-light border rounded shadow-sm mb-4">
          <h1 className="mb-0">📋 Задачі</h1>
        </div>
      </div>

      {/* 🔵 Лише одна кнопка */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/calendar")}
          className="btn btn-primary"
        >
          Календар
        </button>
      </div>
      <TaskList />
    </div>
  );
};

export default TasksPage;
