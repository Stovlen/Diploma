import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/profile", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setUser(res.data);
        setOccupation(res.data.occupation || "");
      })
      .catch((err) => console.error("Помилка при отриманні профілю:", err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/profile",
        { occupation },
        { headers: getAuthHeaders() }
      );
      setUser(res.data.user);
      setEditMode(false);
      setMessage("✅ Профіль оновлено");
    } catch (err) {
      console.error("Помилка при оновленні:", err);
      setMessage("❌ Не вдалося оновити профіль");
    }
  };

  if (!user) return <p className="text-center mt-5">Завантаження...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Профіль користувача</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <p>
          <strong>Ім’я:</strong> {user.name}
        </p>
        <p>
          <strong>Стать:</strong> {user.gender}
        </p>

        {!editMode ? (
          <>
            <p>
              <strong>Рід діяльності:</strong>{" "}
              {user.occupation || (
                <span className="text-muted">не вказано</span>
              )}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Роль:</strong>{" "}
              <span className="badge bg-secondary">{user.role}</span>
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-outline-primary mt-3"
            >
              Редагувати рід діяльності
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Рід діяльності</label>
              <input
                type="text"
                className="form-control"
                name="occupation"
                placeholder="Введіть рід діяльності"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Зберегти
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Скасувати
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
