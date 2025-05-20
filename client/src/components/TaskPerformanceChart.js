// src/components/TaskPerformanceChart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getAuthHeaders } from "../utils/authHeaders";

const TaskPerformanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        const completedTasks = res.data.filter(
          (task) => task.status === "done"
        );

        // Групуємо по датах виконання (createdAt)
        const counts = {};
        completedTasks.forEach((task) => {
          const date = new Date(task.createdAt).toLocaleDateString("uk-UA");
          counts[date] = (counts[date] || 0) + 1;
        });

        const chartData = Object.entries(counts).map(([date, value]) => ({
          date,
          completed: value,
        }));

        setData(chartData);
      })
      .catch((err) => console.error("Помилка при завантаженні задач:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h3>Динаміка продуктивності</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#82ca9d"
          name="Виконано задач"
        />
      </LineChart>
    </div>
  );
};

export default TaskPerformanceChart;
