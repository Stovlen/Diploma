import React from "react";
import TaskAnalytics from "../components/TaskAnalytics";
import TaskPriorityChart from "../components/TaskPriorityChart";
import TaskPerformanceChart from "../components/TaskPerformanceChart";

const DashboardPage = () => {
  return (
    <div>
      <h1>Статистика задач</h1>
      <TaskAnalytics />
      <TaskPriorityChart />
      <TaskPerformanceChart />
    </div>
  );
};

export default DashboardPage;
