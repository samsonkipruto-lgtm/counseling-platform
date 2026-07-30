import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { QueueTable } from "../components/QueueTable";
import { getMyCompletedSessions, type QueueBooking } from "../api/bookingAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../components/dashboard.css";

export function CounselorHistoryPage() {
  const [sessions, setSessions] = useState<QueueBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      setSessions(await getMyCompletedSessions());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load session history."));
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
        <p className="subtitle">Completed sessions and their records.</p>

        {loading && <p>Loading...</p>}
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && (
          <QueueTable bookings={sessions} showRecordLink />
        )}
      </div>
    </div>
  );
}
