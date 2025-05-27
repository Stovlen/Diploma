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

  if (error)
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="alert alert-info text-center" role="alert">
        Завантаження рекомендації...
      </div>
    );

  return (
    <div className="alert alert-success" role="alert">
      <strong>Рекомендація ШІ:</strong> {data.suggestion}
    </div>
  );
};

export default TaskSuggestion;
