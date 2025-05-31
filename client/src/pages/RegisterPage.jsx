import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    occupation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Паролі не співпадають");
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Помилка реєстрації");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Серверна помилка");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Реєстрація</h2>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Ім'я</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Введіть ім'я"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Рід діяльності</label>
            <input
              type="text"
              name="occupation"
              className="form-control"
              placeholder="Введіть рід діяльності"
              value={form.occupation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Стать</label>
            <select
              name="gender"
              className="form-select"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Оберіть стать</option>
              <option value="Чоловік">Чоловік</option>
              <option value="Жінка">Жінка</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Введіть email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Пароль</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Введіть пароль"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Сховати" : "Показати"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Підтвердити пароль</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control"
                placeholder="Повторіть пароль"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "Сховати" : "Показати"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Зареєструватися
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Уже є акаунт?{" "}
            <Link to="/login" className="text-decoration-none">
              Увійти
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
