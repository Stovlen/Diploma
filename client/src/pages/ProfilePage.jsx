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

  if (!user) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Профіль користувача</h2>

      {message && <p>{message}</p>}

      <p>
        <strong>Ім’я:</strong> {user.name}
      </p>
      <p>
        <strong>Стать:</strong> {user.gender}
      </p>

      {!editMode ? (
        <>
          <p>
            <strong>Рід діяльності:</strong> {user.occupation}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Роль:</strong> {user.role}
          </p>
          {/*<p>
            <strong>Дата створення:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString("uk-UA")}
          </p>*/}
          <button onClick={() => setEditMode(true)}>
            Редагувати рід діяльності
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="occupation"
            placeholder="Рід діяльності"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
          <button type="submit">Зберегти</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Скасувати
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
