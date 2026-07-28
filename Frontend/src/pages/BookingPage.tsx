import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SlotCard } from "../components/SlotCard";
import { AliasTag } from "../components/AliasTag";
import {
  getSlots,
  createBooking,
  type SessionSlot,
  type Booking,
} from "../api/bookingAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../pages/dashboard.css";

export function BookingPage() {
  const [slots, setSlots] = useState<SessionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSlots();
      setSlots(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load available slots."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadSlots();
  }, [loadSlots]);

  async function handleBook(slotId: number) {
    setError("");
    setBookingSlotId(slotId);
    try {
      const booking = await createBooking(slotId);
      setConfirmedBooking(booking);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to book this slot. It may have just been taken.",
        ),
      );
      loadSlots();
    } finally {
      setBookingSlotId(null);
    }
  }

  if (confirmedBooking) {
    return (
      <div>
        <Navbar />
        <div className="dashboard-container">
          <div className="dashboard-card">
            <h1>Booking Confirmed</h1>
            <p className="subtitle">Booked under alias</p>
            <AliasTag alias={confirmedBooking.alias_code} />
            <p style={{ marginTop: "1rem" }}>
              <strong>
                {new Date(confirmedBooking.slot_datetime).toLocaleString()}
              </strong>
            </p>
            <button
              onClick={() => navigate("/student")}
              style={{ marginTop: "1rem" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Book a Session</h1>

        {loading && <p>Loading available slots...</p>}
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {!loading && slots.length === 0 && !error && (
          <p>No available slots right now. Check back later.</p>
        )}

        {!loading &&
          slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onBook={handleBook}
              booking={bookingSlotId === slot.id}
            />
          ))}
      </div>
    </div>
  );
}
