// src/components/TaskPriorityChart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getAuthHeaders } from "../utils/authHeaders";

const COLORS = {
  low: "#8dd1e1",
  medium: "#ffc658",
  high: "#ff8042",
};

const TaskPriorityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        const priorities = res.data.reduce(
          (acc, task) => {
            acc[task.priority]++;
            return acc;
          },
          { low: 0, medium: 0, high: 0 }
        );

        const chartData = Object.entries(priorities).map(([key, value]) => ({
          name:
            key === "low"
              ? "Низький"
              : key === "medium"
              ? "Середній"
              : "Високий",
          value,
          raw: key,
        }));

        setData(chartData);
      })
      .catch((err) => console.error("Помилка при завантаженні задач:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h3>Розподіл задач за пріоритетом</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.raw]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TaskPriorityChart;
