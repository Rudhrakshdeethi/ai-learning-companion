import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">AI</span>
          AI Learning Companion
        </Link>

        <div className="nav-menu">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            className={`nav-link ${isActive("/upload") ? "active" : ""}`}
          >
            Upload
          </Link>
          <Link
            to="/chat"
            className={`nav-link ${isActive("/chat") ? "active" : ""}`}
          >
            Chat
          </Link>
          <Link
            to="/graph"
            className={`nav-link ${isActive("/graph") ? "active" : ""}`}
          >
            Graph
          </Link>
          <Link
            to="/workspace"
            className={`nav-link ${isActive("/workspace") ? "active" : ""}`}
          >
            Workspace
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
