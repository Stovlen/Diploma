import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const TaskAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks/analytics", {
        headers: getAuthHeaders(),
      })
      .then((res) => setAnalytics(res.data))
      .catch((err) => {
        console.error("Аналітика помилка:", err);
        setError("Не вдалося отримати аналітику");
      });
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!analytics) return <p>Завантаження аналітики...</p>;

  const { summary, metrics } = analytics;

  return (
    <div
      style={{
        backgroundColor: "#e3f2fd",
        border: "1px solid #90caf9",
        padding: "12px",
        borderRadius: "5px",
        marginTop: "16px",
      }}
    >
      <strong>Аналітика продуктивності:</strong>
      <p style={{ marginTop: "8px" }}>{summary}</p>
      <ul>
        <li>Усього задач: {metrics.total}</li>
        <li>Виконано: {metrics.completed}</li>
        <li>У процесі: {metrics.inProgress}</li>
        <li>Прострочено: {metrics.overdue}</li>
      </ul>
      <p>Найпопулярніші категорії:</p>
      <ul>
        {Object.entries(metrics.categories).map(([cat, count]) => (
          <li key={cat}>
            {cat}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskAnalytics;
