// src/pages/TasksPage.jsx
import React from "react";
import TaskList from "../components/TaskList";
import DailyTip from "../components/DailyTip";
import TaskSuggestion from "../components/TaskSuggestion"; // ✅ уже імпортований
import TaskAnalytics from "../components/TaskAnalytics";
import TaskPriorityChart from "../components/TaskPriorityChart";
import TaskPerformanceChart from "../components/TaskPerformanceChart";



const TasksPage = ({ onLogout }) => {
  return (
    <div>
      <button onClick={onLogout}>Вийти</button>
      <h1>Задачі</h1>
      <DailyTip /> {/* ✅ Щоденна порада */}
      <TaskSuggestion /> {/* ✅ Рекомендація від ШІ */}
      <TaskAnalytics />
      <TaskPriorityChart />
      <TaskPerformanceChart />
      <TaskList />
    </div>
  );
};

export default TasksPage;
