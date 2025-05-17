// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/profile", {
        headers: getAuthHeaders(),
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Помилка при отриманні профілю:", err));
  }, []);

  if (!user) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Профіль користувача</h2>
      <p>
        <strong>Ім’я:</strong> {user.name || "—"}
      </p>
      <p>
        <strong>Стать:</strong> {user.gender || "—"}
      </p>
      <p>
        <strong>Рід діяльності:</strong> {user.occupation || "—"}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Роль:</strong> {user.role}
      </p>
      <p>
        <strong>Дата створення:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString("uk-UA")}
      </p>
    </div>
  );
};

export default ProfilePage;
