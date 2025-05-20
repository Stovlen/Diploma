// src/components/TaskAnalytics.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#ff9800", "#f44336"]; // Готово, У процесі, Прострочено

const TaskAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks/analytics", {
        headers: getAuthHeaders(),
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Помилка при отриманні аналітики:", err));
  }, []);

  if (!data) return <p>Завантаження аналітики...</p>;

  const pieData = [
    { name: "Виконано", value: data.metrics.completed },
    { name: "У процесі", value: data.metrics.inProgress },
    { name: "Прострочено", value: data.metrics.overdue },
  ];

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Статус задач</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskAnalytics;
