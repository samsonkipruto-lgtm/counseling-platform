import { Link } from "react-router-dom";
import type { QueueBooking } from "../api/bookingAPI";
import "./queueTable.css";

interface QueueTableProps {
  bookings: QueueBooking[];
  showRecordLink?: boolean;
  onComplete?: (bookingId: number) => void;
  completingId?: number | null;
}

export function QueueTable({
  bookings,
  showRecordLink = false,
  onComplete,
  completingId = null,
}: QueueTableProps) {
  if (bookings.length === 0) {
    return <p>No bookings to show.</p>;
  }

  return (
    <table className="queue-table">
      <thead>
        <tr>
          <th>Alias</th>
          <th>Time</th>
          <th>Status</th>
          {showRecordLink && <th></th>}
          {onComplete && <th></th>}
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td>
              <span className="alias-badge">{booking.alias_code}</span>
              {booking.real_name && (
                <span className="revealed-name"> — {booking.real_name}</span>
              )}
            </td>
            <td>{new Date(booking.slot_datetime).toLocaleString()}</td>
            <td>
              <span className={`status-pill status-${booking.status}`}>
                {booking.status}
              </span>
            </td>
            {showRecordLink && (
              <td>
                <Link
                  to={`/counselor/record/${booking.id}`}
                  state={{ bookingId: booking.id }}
                >
                  Open record
                </Link>
              </td>
            )}
            {onComplete && (
              <td>
                {booking.status === "waiting" && (
                  <button
                    type="button"
                    onClick={() => onComplete(booking.id)}
                    disabled={completingId === booking.id}
                  >
                    {completingId === booking.id
                      ? "Completing..."
                      : "Mark Complete"}
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
