import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ isAuthenticated, userRole, children }) => {
  if (!isAuthenticated || !userRole) {
    return null; 
  }

  if (userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
