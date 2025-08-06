import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in using localStorage (this is just a placeholder)
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    // Redirect to login if not logged in, or dashboard if logged in
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [navigate]);
  
  // This is just a fallback, the redirect should happen before this renders
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Creditor Academy</h1>
        <p className="text-xl text-gray-600">Loading your private education experience...</p>
      </div>
    </div>
  );
};

export default Index;