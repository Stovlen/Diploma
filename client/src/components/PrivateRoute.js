// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, requiredRole, children }) => {
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== requiredRole) {
        return <Navigate to="/tasks" replace />;
      }
    } catch (err) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
