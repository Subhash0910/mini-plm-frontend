import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBoxes, FaFileAlt, FaExchangeAlt, FaUserCircle } from "react-icons/fa";
import AuthService from "../services/AuthService";
import { auth } from "../services/auth";

function Layout({ children }) {
  const navigate = useNavigate();
  const user = auth.getUser();
  const loggedIn = auth.isLoggedIn();

  const onLogout = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="wc-root">
      <header className="wc-header">
        <div className="wc-header-left">
          <div className="wc-logo">
            Windchill <strong style={{ fontWeight: 800 }}>13</strong>
          </div>
          <div className="wc-product-name">Mini PLM</div>
        </div>

        <div className="wc-header-right">
          <FaUserCircle style={{ marginRight: 8 }} />
          {loggedIn ? (
            <>
              <span style={{ marginRight: 12 }}>
                User: {user?.username || "(unknown)"}{user?.role ? ` (${user.role})` : ""}
              </span>
              <button className="btn btn-sm btn-outline-light" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline-light">
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="wc-main">
        <nav className="wc-sidebar" aria-label="Main navigation">
          <div className="wc-brand">Mini PLM</div>
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}
                style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none" }}>
                <FaBoxes style={{ minWidth: 18 }} /> <span>Parts</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/documents" className={({ isActive }) => (isActive ? "active" : "")}
                style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none" }}>
                <FaFileAlt style={{ minWidth: 18 }} /> <span>Documents</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/changes" className={({ isActive }) => (isActive ? "active" : "")}
                style={{ display: "flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none" }}>
                <FaExchangeAlt style={{ minWidth: 18 }} /> <span>Changes</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="wc-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
