import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const DailyTip = () => {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ai/daily-tip", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setTip(res.data.tip);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Помилка при отриманні поради:", err);
        setError("Не вдалося завантажити пораду на сьогодні.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Завантаження поради...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        backgroundColor: "#e7f3ff",
        border: "1px solid #bee3f8",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "15px",
      }}
    >
      <strong>Порада на сьогодні:</strong> {tip}
    </div>
  );
};

export default DailyTip;
