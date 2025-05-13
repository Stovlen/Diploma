// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProfilePage from "./pages/ProfilePage";

function App() {
  // ✅ 1. Стан одразу ініціалізується з localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  // ✅ 2. При логіні записуємо токен і роль
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserRole(localStorage.getItem("userRole") || "");
  };

  // ✅ 3. При виході очищаємо все
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        <Route
          path="/tasks"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TasksPage onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <AdminPage onLogout={handleLogout} />
            </AdminRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
