// src/components/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ isAuthenticated, userRole, children }) => {
  // Якщо роль ще не зчитана, не рендеримо нічого
  if (!isAuthenticated || !userRole) {
    return null; // або можна показати loader
  }

  if (userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
