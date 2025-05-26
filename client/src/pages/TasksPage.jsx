import React from "react";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";

const TasksPage = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={onLogout}>Вийти</button>
      <h1>Задачі</h1>

    
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => navigate("/tips")}>ШІ поради</button>
        <button onClick={() => navigate("/dashboard")}>Статистика</button>
        <button onClick={() => navigate("/calendar")}>Календар</button>{" "}
      </div>

      <TaskList />
    </div>
  );
};

export default TasksPage;
