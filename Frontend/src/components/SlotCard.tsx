import type { SessionSlot } from "../api/bookingAPI";
import "./slotCard.css";

interface SlotCardProps {
  slot: SessionSlot;
  onBook: (slotId: number) => void;
  booking: boolean;
}

export function SlotCard({ slot, onBook, booking }: SlotCardProps) {
  const date = new Date(slot.slot_datetime);
  const formatted = date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="slot-card">
      <span className="slot-datetime">{formatted}</span>
      <button onClick={() => onBook(slot.id)} disabled={booking}>
        {booking ? "Booking..." : "Book"}
      </button>
    </div>
  );
}
