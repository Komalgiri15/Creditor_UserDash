import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "@/services/userService";

const ProtectedRoute = ({ children }) => {
  // Check for token using the centralized function
  const token = getAuthToken();
  
  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
