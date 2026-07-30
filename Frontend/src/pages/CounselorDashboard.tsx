import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { QueueTable } from "../components/QueueTable";
import {
  getQueue,
  completeSession,
  getMySlots,
  type QueueBooking,
  type SessionSlot,
} from "../api/bookingAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../components/dashboard.css";

export function CounselorDashboard() {
  const [bookings, setBookings] = useState<QueueBooking[]>([]);
  const [mySlots, setMySlots] = useState<SessionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingId, setCompletingId] = useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [queueData, slotData] = await Promise.all([
        getQueue(),
        getMySlots(),
      ]);
      setBookings(queueData);
      setMySlots(slotData);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load your dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadDashboard();
  }, [loadDashboard]);

  async function handleComplete(bookingId: number) {
    setError("");
    setCompletingId(bookingId);
    try {
      await completeSession(bookingId);
      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to mark session complete."));
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Your Dashboard</h1>

        {loading && <p>Loading...</p>}
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="dashboard-card">
              <p className="subtitle">Your slots</p>
              {mySlots.length === 0 ? (
                <p>No slots assigned yet.</p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    fontSize: "0.9rem",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      <th style={{ padding: "0.5rem 0" }}>Date &amp; time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySlots.map((s) => (
                      <tr
                        key={s.id}
                        style={{ borderTop: "1px solid var(--color-border)" }}
                      >
                        <td style={{ padding: "0.5rem 0" }}>
                          {new Date(s.slot_datetime).toLocaleString()}
                        </td>
                        <td>{s.is_available ? "Open" : "Booked"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-card">
              <p className="subtitle">Your queue</p>
              <p className="subtitle" style={{ fontSize: "0.8rem" }}>
                Real names appear only once a session is within 24 hours.
              </p>
              <QueueTable
                bookings={bookings}
                showRecordLink
                onComplete={handleComplete}
                completingId={completingId}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
