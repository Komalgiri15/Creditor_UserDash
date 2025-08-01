import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  // Check for token in both cookies and localStorage
  const token = Cookies.get("token") || localStorage.getItem("token");
  
  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
