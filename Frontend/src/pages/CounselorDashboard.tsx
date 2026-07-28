import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { QueueTable } from "../components/QueueTable";
import {
  getQueue,
  completeSession,
  type QueueBooking,
} from "../api/bookingAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../pages/dashboard.css";

export function CounselorDashboard() {
  const [bookings, setBookings] = useState<QueueBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingId, setCompletingId] = useState<number | null>(null);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getQueue();
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load your queue."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadQueue();
  }, [loadQueue]);

  async function handleComplete(bookingId: number) {
    setError("");
    setCompletingId(bookingId);
    try {
      await completeSession(bookingId);
      await loadQueue();
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
        <h1>Your Queue</h1>
        <p className="subtitle">
          Real names appear only once a session is within 24 hours.
        </p>

        {loading && <p>Loading...</p>}
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <QueueTable
            bookings={bookings}
            showRecordLink
            onComplete={handleComplete}
            completingId={completingId}
          />
        )}
      </div>
    </div>
  );
}
