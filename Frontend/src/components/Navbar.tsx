import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./navbar.css";

const ADMIN_NAV_ITEMS = [
  { path: "/admin/overview", label: "Overview" },
  { path: "/admin/counselors", label: "Register Counselor" },
  { path: "/admin/slots", label: "Create Slot" },
  { path: "/admin/audit", label: "Audit Log" },
];

const STUDENT_NAV_ITEMS = [
  { path: "/student", label: "Dashboard" },
  { path: "/book", label: "Book a Session" },
  { path: "/student/history", label: "History" },
];

const COUNSELOR_NAV_ITEMS = [
  { path: "/counselor", label: "Dashboard" },
  { path: "/counselor/history", label: "History" },
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
        {role === "student" &&
          STUDENT_NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        {role === "counselor" &&
          COUNSELOR_NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
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
