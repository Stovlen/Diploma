import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        onLogin();

        // 🔁 Перенаправлення за роллю
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/tasks");
        }
      } else {
        setError(data.error || "Помилка авторизації");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Серверна помилка");
    }
  };
  

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Вхід</h2>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Введіть email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Увійти
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Ще не маєте акаунта?{" "}
            <Link to="/register" className="text-decoration-none">
              Зареєструватися
            </Link>
          </small>
        </div>

        <div className="text-center mt-2">
          <small>
            Забули пароль?{" "}
            <Link to="/forgot-password" className="text-decoration-none">
              Скинути
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
