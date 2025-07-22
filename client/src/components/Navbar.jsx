import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const { token, isAdmin } = useAuth();

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);



  
  const handleNavClick = () => {
    setMenuOpen(false); // Close menu when any link is clicked
  };

  return (
    <nav className="navbar bg-[var(--nav)] border-b-2 border-[var(--border)]">
      <div className="navbar-logo ">
        <NavLink to="/" onClick={handleNavClick}>
          <img src="/LOGO2.png" alt="Logo" className="h-10" />
        </NavLink>
      </div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>

        <NavLink to="/" className="nav-link" onClick={handleNavClick}>
          DOC
        </NavLink>

        {token && (
          <>
            <NavLink to="/upload" className="nav-link" onClick={handleNavClick}>
              Upload
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/dashboard"
                className="nav-link"
                onClick={handleNavClick}
              >
                Dashboard
              </NavLink>
            )}
            <NavLink
              to="/profile"
              className="nav-link"
              onClick={handleNavClick}
            >
              Profile
            </NavLink>
          </>
        )}

        {/* {!token ? (
          <NavLink to="/auth" className="nav-link" onClick={handleNavClick}>
            Login / Sign Up
          </NavLink>
        ) : (
          <button className="nav-link logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )} */}

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
