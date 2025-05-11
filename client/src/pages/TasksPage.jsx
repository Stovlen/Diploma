// src/pages/TasksPage.jsx
import React from "react";
import TaskList from "../components/TaskList";

const TasksPage = ({ onLogout }) => {
  return (
    <div>
      <button onClick={onLogout}>Вийти</button>
      <TaskList />
    </div>
  );
};

export default TasksPage;
