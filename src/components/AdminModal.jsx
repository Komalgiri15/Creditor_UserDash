import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Admin Modal Component
const AdminModal = ({ isOpen, onClose }) => {
  // AUTH LOGIC COMMENTED OUT
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    onClose && onClose();
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const credentials = isLogin ? { email, password } : { fullName, email, password };
    const url = isLogin ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
    try {
      const response = await axios.post(url, credentials, {
        withCredentials: true,
      });
      if (response.data.success) {
        setIsLoggedIn(true);
        onClose && onClose();
        window.location.href = "/dashboard";
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || (isLogin ? "Invalid email or password. Please try again." : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // The following block is now redundant as all auth logic is commented out.
  // Keeping it for now in case the user wants to re-introduce auth UI later.
  /*
  if (isLoggedIn) {
    return (
      <div style={overlayStyle}>
        <div style={modalContainerStyle}>
          <div style={modalStyle}>
            <button style={closeBtnStyle} onClick={onClose}>×</button>
            <h2 style={headingStyle}>You are logged in!</h2>
            <button style={submitBtnStyle} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }
  */

  return (
    <div style={overlayStyle}>
      <div style={modalContainerStyle}>
        <div style={modalStyle}>
          <button style={closeBtnStyle} onClick={onClose}>×</button>

          <h2 style={headingStyle}>{isLogin ? "Welcome" : "Create Account"}</h2>

          {error && (
            <div style={{ color: "#b91c1c", marginBottom: 10, fontWeight: 500 }}>{error}</div>
          )}

          <form style={formStyle} onSubmit={handleSubmit}>
            {/* In the form, comment out the fullName field and registration button */}
            {/*
            {!isLogin && (
              <input
                type="text"
                placeholder=" Full Name"
                style={inputStyle}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            )}
            */}
            <input
              type="email"
              placeholder=" Email"
              style={inputStyle}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder=" Password"
              style={inputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit" style={submitBtnStyle} disabled={loading}>
              {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login →" : "Register →")}
            </button>
          </form>

          {/* Comment out the toggle link in the form */}
          {/*
          <p style={toggleTextStyle}>
            {isLogin ? "New here?" : "Already registered?"} {" "}
            <span style={toggleLinkStyle} onClick={toggleMode}>
              {isLogin ? "Register Now" : "Login"}
            </span>
          </p>
          */}
        </div>
      </div>
    </div>
  );
};

// ✅ Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(8, 8, 8, 0.7)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalContainerStyle = {
  animation: "fadeIn 0.3s ease-in-out",
  transition: "all 0.3s ease-in-out",
};

const modalStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "32px 28px 24px 28px",
  minWidth: 340,
  maxWidth: 400,
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
};

const closeBtnStyle = {
  position: "absolute",
  top: 12,
  right: 18,
  background: "none",
  border: "none",
  fontSize: 28,
  color: "#888",
  cursor: "pointer",
};

const headingStyle = {
  fontSize: "1.7rem",
  fontWeight: 700,
  marginBottom: 18,
  textAlign: "center",
  color: "#0D88C2",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginBottom: 10,
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  marginBottom: 8,
  outline: "none",
  fontFamily: "inherit",
};

const submitBtnStyle = {
  background: "#0D88C2",
  color: "#fff",
  padding: "12px 0",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: "1.1rem",
  cursor: "pointer",
  marginTop: 8,
  transition: "background 0.3s ease",
};

const toggleTextStyle = {
  textAlign: "center",
  marginTop: 12,
  color: "#333",
  fontSize: "1rem",
};

const toggleLinkStyle = {
  color: "#0D88C2",
  cursor: "pointer",
  fontWeight: 600,
  marginLeft: 4,
  textDecoration: "underline",
};

// ✅ Keyframe animation
const fadeInKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
`;

if (typeof document !== "undefined" && !document.getElementById("modal-fadein-keyframes")) {
  const styleTag = document.createElement("style");
  styleTag.id = "modal-fadein-keyframes";
  styleTag.innerHTML = fadeInKeyframes;
  document.head.appendChild(styleTag);
}

export default AdminModal;
