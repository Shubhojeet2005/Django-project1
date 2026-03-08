import { NavLink, useNavigate } from "react-router-dom";
import "./SidePanel.css";
import { isAuthenticated, clearToken } from "../utils/auth";
import PropTypes from 'prop-types';

function SidePanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`side-panel-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`side-panel ${isOpen ? 'open' : ''}`} aria-label="Secondary navigation">
        <button className="close-panel" onClick={onClose} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="side-panel-header">
          <div className="side-panel-badge">MyStore</div>
          <p className="side-panel-subtitle">
            {authed ? "Welcome back ✨" : "Browse, sign in, and shop"}
          </p>
        </div>

        <nav className="side-panel-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `side-panel-link ${isActive ? "active" : ""}`
            }
            end
          >
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `side-panel-link ${isActive ? "active" : ""}`
            }
          >
            <span>Cart</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `side-panel-link ${isActive ? "active" : ""}`
            }
          >
            <span>Order history</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `side-panel-link ${isActive ? "active" : ""}`
            }
          >
            <span>About us</span>
          </NavLink>
        </nav>

        <div className="side-panel-footer">
          {authed ? (
            <button type="button" className="side-panel-cta" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <button
              type="button"
              className="side-panel-cta"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

SidePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SidePanel;
