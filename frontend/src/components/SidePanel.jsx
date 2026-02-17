import { NavLink, useNavigate } from "react-router-dom";
import "./SidePanel.css";
import { isAuthenticated, clearToken } from "../utils/auth";

function SidePanel() {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <aside className="side-panel" aria-label="Secondary navigation">
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
  );
}

export default SidePanel;

