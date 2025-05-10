import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TaskList from "./components/TaskList";
import LoginForm from "./components/LoginForm";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <button onClick={handleLogout}>Вийти</button>}

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/tasks" />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TaskList />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
