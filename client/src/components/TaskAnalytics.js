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

const COLORS = ["#4caf50", "#ff9800", "#f44336"]; // Виконано, У процесі, Прострочено

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

  if (!data)
    return (
      <div className="alert alert-info text-center" role="alert">
        Завантаження аналітики...
      </div>
    );

  const pieData = [
    { name: "Виконано", value: data.metrics.completed },
    { name: "У процесі", value: data.metrics.inProgress },
    { name: "Прострочено", value: data.metrics.overdue },
  ];

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-4">📊 Статус задач</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;
