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
  ResponsiveContainer,
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

        const counts = {};
        completedTasks.forEach((task) => {
          const date = new Date(task.updatedAt).toISOString().split("T")[0]; // 👈 Використовуємо дату оновлення
          counts[date] = (counts[date] || 0) + 1;
        });

        const chartData = Object.entries(counts)
          .map(([date, value]) => ({
            date,
            completed: value,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // 👈 сортування за датою

        setData(chartData);
      })
      .catch((err) => console.error("Помилка при завантаженні задач:", err));
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-4">📈 Динаміка продуктивності</h3>
        {data.length === 0 ? (
          <div className="text-center text-muted fs-5">
            Жодного завдання не виконано
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#198754"
                name="Виконано задач"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TaskPerformanceChart;
