import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { AliasTag } from "../components/AliasTag";
import { getMyAlias } from "../api/aliasAPI";
import { getMyBooking, cancelBooking, type Booking } from "../api/bookingAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../components/dashboard.css";

export function StudentDashboard() {
  const [alias, setAlias] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aliasData, bookingData] = await Promise.all([
        getMyAlias(),
        getMyBooking(),
      ]);
      setAlias(aliasData.alias);
      setBooking(bookingData);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadData();
  }, [loadData]);

  async function handleCancel() {
    if (!booking) return;
    setCancelling(true);
    setError("");
    try {
      await cancelBooking(booking.id);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to cancel booking."));
    } finally {
      setCancelling(false);
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
              <p className="subtitle">Your alias</p>
              <AliasTag alias={alias} />
            </div>

            <div className="dashboard-card">
              <p className="subtitle">Upcoming session</p>
              {booking ? (
                <div>
                  <p>
                    <strong>
                      {new Date(booking.slot_datetime).toLocaleString()}
                    </strong>
                  </p>
                  <p>Status: {booking.status}</p>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    style={{ marginTop: "0.75rem" }}
                  >
                    {cancelling ? "Cancelling..." : "Cancel Session"}
                  </button>
                </div>
              ) : (
                <p>No upcoming session booked.</p>
              )}
            </div>

            <Link to="/book">
              <button>Book a Session</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
