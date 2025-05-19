import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const TaskSuggestion = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks/suggestions", {
        headers: getAuthHeaders(),
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("AI suggestion error:", err);
        setError("Не вдалося отримати рекомендацію");
      });
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data) return <p>Завантаження рекомендації...</p>;

  return (
    <div
      style={{
        backgroundColor: "#e9f7ef",
        border: "1px solid #b2dfdb",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "15px",
      }}
    >
      <strong>Рекомендація ШІ:</strong> {data.suggestion}
    </div>
  );
};

export default TaskSuggestion;
