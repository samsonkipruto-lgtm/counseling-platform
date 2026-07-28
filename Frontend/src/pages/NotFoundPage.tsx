import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/login">Back to Login</Link>
    </div>
  );
}
