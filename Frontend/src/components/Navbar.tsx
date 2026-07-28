import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./navbar.css";

export function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Counseling Portal</div>
      <div className="navbar-links">
        {role === "student" && <Link to="/student">Dashboard</Link>}
        {role === "counselor" && <Link to="/counselor">Dashboard</Link>}
        {role === "admin" && <Link to="/admin">Dashboard</Link>}
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
