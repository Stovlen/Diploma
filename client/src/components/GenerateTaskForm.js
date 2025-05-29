import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
      toast.success("🧠 Задачу згенеровано успішно!");
      setPrompt("");
    } catch (err) {
      console.error("❌ Помилка генерації задачі:", err);
      setError("Не вдалося згенерувати задачу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 p-4 border border-dashed bg-white rounded">
      <h4 className="mb-3">🧠 Генерація задачі за описом</h4>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Наприклад: Записатися до стоматолога"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Генеруємо..." : "Згенерувати"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mt-3 mb-0 text-center">{error}</div>
      )}
    </div>
  );
};

export default GenerateTaskForm;
