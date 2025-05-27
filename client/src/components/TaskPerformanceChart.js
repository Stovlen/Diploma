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
    <div className="mt-5">
      <h4 className="text-center mb-4">📈 Динаміка продуктивності</h4>

      <div className="card shadow p-3">
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
      </div>
    </div>
  );
};

export default TaskPerformanceChart;
