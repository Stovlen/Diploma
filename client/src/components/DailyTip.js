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

  if (loading)
    return (
      <div className="alert alert-info text-center" role="alert">
        Завантаження поради...
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );

  return (
    <div className="alert alert-primary" role="alert">
      <strong>Порада на сьогодні:</strong> {tip}
    </div>
  );
};

export default DailyTip;
