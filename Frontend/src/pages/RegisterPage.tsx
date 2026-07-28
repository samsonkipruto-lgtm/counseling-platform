import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent } from "../api/authAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../components/ui.css";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alias, setAlias] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerStudent({ email, full_name: fullName });
      setAlias(data.alias);
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Try again."));
    } finally {
      setLoading(false);
    }
  }

  if (alias) {
    return (
      <div className="auth-shell">
        <div className="auth-card alias-result">
          <h1>You're registered</h1>
          <p className="subtitle">
            This is your alias — save it. It's how you'll be identified
            everywhere in the system.
          </p>
          <span className="alias-badge">{alias}</span>
          <p className="subtitle">Also sent to your email.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Register</h1>
        <p className="subtitle">
          Create your account. You'll be identified by an alias, never your
          name.
        </p>
        <form onSubmit={handleRegister}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
