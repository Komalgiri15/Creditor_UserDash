import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const ProtectedRoute = ({ children }) => {
  const { userProfile, isLoading } = useUser();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If no user profile, redirect to login
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
