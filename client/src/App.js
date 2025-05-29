import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import TasksPage from "./pages/TasksPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProfilePage from "./pages/ProfilePage";
import TipsPage from "./pages/TipsPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarView from "./pages/CalendarView";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // Сторінки без navbar/footer
  const noLayoutRoutes = ["/login", "/register", "/forgot-password"];

  // окремо обробимо reset-password, бо там параметр у шляху
  const isNoLayout =
    noLayoutRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isNoLayout && <Navbar />}
      <main className="flex-grow-1">{children}</main>
      {!isNoLayout && <Footer />}
    </div>
  );
};

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
      <LayoutWrapper>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

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
          <Route
            path="/calendar"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CalendarView />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
