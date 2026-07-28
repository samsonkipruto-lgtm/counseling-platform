import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestOTP } from "../api/authAPI";
import { useAuth } from "../context/useAuth";
import { getErrorMessage } from "../utils/errorUtils";
import "../components/ui.css";

const RESEND_COOLDOWN_SECONDS = 30;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestOTP(email);
      setOtpSent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to send OTP. Try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setResendMessage("");
    setResending(true);

    try {
      await requestOTP(email);
      setResendMessage("A new code has been sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to resend OTP. Try again shortly."),
      );
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const role = await login(email, otp);
      if (role === "student") navigate("/student");
      else if (role === "counselor") navigate("/counselor");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired OTP."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="subtitle">Enter your email to receive a one-time code.</p>

        {!otpSent ? (
          <form onSubmit={handleRequestOtp}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label htmlFor="otp">Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="auth-footer">
              {cooldown > 0 ? (
                <>Resend code in {cooldown}s</>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    textDecoration: "underline",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  {resending ? "Resending..." : "Resend code"}
                </button>
              )}
            </p>
            {resendMessage && (
              <p style={{ color: "var(--color-success)", fontSize: "0.85rem" }}>
                {resendMessage}
              </p>
            )}
          </form>
        )}

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {!otpSent && (
          <p className="auth-footer">
            New here? <Link to="/register">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
}
