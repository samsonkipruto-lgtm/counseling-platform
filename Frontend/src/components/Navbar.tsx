import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./navbar.css";

const ADMIN_NAV_ITEMS = [
  { path: "/admin/overview", label: "Overview" },
  { path: "/admin/counselors", label: "Register Counselor" },
  { path: "/admin/slots", label: "Create Slot" },
  { path: "/admin/audit", label: "Audit Log" },
];

export function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function linkClass(path: string) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Counseling Portal</div>
      <div className="navbar-links">
        {role === "student" && (
          <>
            <Link to="/student" className={linkClass("/student")}>
              Dashboard
            </Link>
            <Link to="/book" className={linkClass("/book")}>
              Book a Session
            </Link>
            <Link
              to="/student/history"
              className={linkClass("/student/history")}
            >
              History
            </Link>
          </>
        )}
        {role === "counselor" && (
          <Link to="/counselor" className={linkClass("/counselor")}>
            Dashboard
          </Link>
        )}
        {role === "admin" &&
          ADMIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
