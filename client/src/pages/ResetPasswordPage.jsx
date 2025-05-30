import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Пароль успішно змінено. Перенаправлення...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Помилка скидання");
      }
    } catch (err) {
      setError("Серверна помилка");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Скидання пароля</h2>

        {message && (
          <div className="alert alert-success text-center" role="alert">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              Новий пароль
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              placeholder="Введіть новий пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Оновити пароль
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
