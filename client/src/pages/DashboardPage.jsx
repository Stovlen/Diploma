import React from "react";
import TaskAnalytics from "../components/TaskAnalytics";
import TaskPriorityChart from "../components/TaskPriorityChart";
import TaskPerformanceChart from "../components/TaskPerformanceChart";

const DashboardPage = () => {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-5">📊 Статистика задач</h2>

      <TaskAnalytics />
      <TaskPriorityChart />
      <TaskPerformanceChart />
    </div>
  );
};

export default DashboardPage;
