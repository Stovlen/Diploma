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


const TaskAnalytics = () => {
  const [data, setData] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        const now = new Date();

        const counts = {
          not_started: 0,
          in_progress: 0,
          done: 0,
        };

        let overdue = 0;

        res.data.forEach((task) => {
          if (task.status === "not_started") counts.not_started++;
          else if (task.status === "in_progress") counts.in_progress++;
          else if (task.status === "done") counts.done++;

          if (
            (task.status === "not_started" || task.status === "in_progress") &&
            task.deadline &&
            new Date(task.deadline) < now
          ) {
            overdue++;
          }
        });

        setData([
          { name: "Очікує", value: counts.not_started, key: "not_started" },
          { name: "У процесі", value: counts.in_progress, key: "in_progress" },
          { name: "Виконано", value: counts.done, key: "done" },
        ]);

        setOverdueCount(overdue); //  оновлюємо кількість прострочених
      })
      .catch((err) => console.error("Помилка при завантаженні задач:", err));
  }, []);

  const COLORS = {
    not_started: "#9e9e9e",
    in_progress: "#ff9800",
    done: "#4caf50",
  };

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
          <>
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

            {/* Додаємо підказку */}
            {overdueCount > 0 && (
              <div className="text-center mt-3 text-danger fw-bold">
                ⚠️ У вас {overdueCount} {overdueCount === 1 ? "прострочена задача" : "прострочених задач"}!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskAnalytics;
