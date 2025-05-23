import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // ⬅️ ДОДАНО
import TasksPage from "./pages/TasksPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProfilePage from "./pages/ProfilePage";

import TipsPage from "./pages/TipsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserRole(localStorage.getItem("userRole") || "");
  };

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
        <Route path="/register" element={<RegisterPage />} /> {/* ⬅️ ДОДАНО */}
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
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
