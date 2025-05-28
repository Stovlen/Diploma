// src/components/HabitInsight.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const HabitInsight = () => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ai/analyze-habits", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setInsight(res.data.insight);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ AI звички помилка:", err);
        setError("Не вдалося отримати аналітику звичок.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="alert alert-info text-center" role="alert">
        Завантаження аналітики звичок...
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="alert alert-warning" role="alert">
      <strong>🧠 Аналіз звичок:</strong> {insight}
    </div>
  );
};

export default HabitInsight;
