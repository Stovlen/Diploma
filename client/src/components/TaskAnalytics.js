import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAuthHeaders } from "../utils/authHeaders";

const COLORS = {
  completed: "#4caf50",
  in_progress: "#ff9800",
  overdue: "#f44336",
};

const TaskAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        const now = new Date();

        const counts = {
          completed: 0,
          in_progress: 0,
          overdue: 0,
        };

        res.data.forEach((task) => {
          if (task.status === "done") {
            counts.completed++;
          } else if (task.status === "in_progress") {
            counts.in_progress++;
          } else if (
            (task.status === "not_started" || task.status === "in_progress") &&
            new Date(task.deadline) < now
          ) {
            counts.overdue++;
          }
        });

        setData([
          { name: "Виконано", value: counts.completed, key: "completed" },
          { name: "У процесі", value: counts.in_progress, key: "in_progress" },
          { name: "Прострочено", value: counts.overdue, key: "overdue" },
        ]);
      })
      .catch((err) => console.error("Помилка при завантаженні задач:", err));
  }, []);

  const hasNoData = data.every((item) => item.value === 0);

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-4">Статус задач</h3>

        {hasNoData ? (
          <div className="text-center text-muted fs-5">
            Жодного завдання немає
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={COLORS[entry.key]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAnalytics;
