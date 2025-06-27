import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import "./styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">logo</div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" className="nav-link" activeclassname="active">
          Home
        </NavLink>
        {token && (
          <>
            <NavLink to="/upload" className="nav-link" activeclassname="active">
              Upload
            </NavLink>
            <NavLink
              to="/dashboard"
              className="nav-link"
              activeclassname="active"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className="nav-link"
              activeclassname="active"
            >
              Profile
            </NavLink>
          </>
        )}

        {!token ? (
          <NavLink to="/auth" className="nav-link" activeclassname="active">
            Login / Sign Up
          </NavLink>
        ) : (
          <button className="nav-link logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar;
