// src/components/GenerateTaskForm.js
import React, { useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const GenerateTaskForm = ({ onTaskGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-task",
        { prompt },
        { headers: getAuthHeaders() }
      );
      onTaskGenerated(res.data);
      setPrompt("");
    } catch (err) {
      console.error("❌ Помилка генерації задачі:", err);
      setError("Не вдалося згенерувати задачу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px dashed gray",
      }}
    >
      <h3>Генерація задачі за описом</h3>
      <input
        type="text"
        value={prompt}
        placeholder="Я хочу зробити..."
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "60%", marginRight: "10px" }}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Генеруємо..." : "Згенерувати"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GenerateTaskForm;
