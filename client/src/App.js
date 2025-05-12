// src/App.js
import React, { useEffect, useState } from "react";
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole"); // очищаємо роль при виході
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
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
