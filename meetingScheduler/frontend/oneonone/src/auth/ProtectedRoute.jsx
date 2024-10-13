import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure this path is correct

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
