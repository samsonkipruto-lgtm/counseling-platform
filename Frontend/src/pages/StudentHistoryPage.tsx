// Frontend/src/pages/StudentHistoryPage.tsx
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { getMyHistory, type Booking } from "../api/bookingAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../components/dashboard.css";

export function StudentHistoryPage() {
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyHistory();
      setHistory(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load your session history."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadHistory();
  }, [loadHistory]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Session History</h1>
        <p className="subtitle">Past sessions booked under your alias.</p>

        {loading && <p>Loading...</p>}
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <p>No past sessions yet.</p>
        )}

        {!loading && !error && history.length > 0 && (
          <table
            style={{
              width: "100%",
              fontSize: "0.9rem",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{ textAlign: "left", color: "var(--color-ink-muted)" }}
              >
                <th style={{ padding: "0.5rem 0" }}>Date &amp; time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <td style={{ padding: "0.5rem 0" }}>
                    {new Date(b.slot_datetime).toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-pill status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
