import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function UserControls() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="navbar-controls">
      {token && (
        <button className="nav-link logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        title="Toggle Theme"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
