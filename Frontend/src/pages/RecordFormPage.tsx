import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
  createRecord,
  getRecordByBooking,
  updateRecord,
} from "../api/recordsAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../pages/dashboard.css";

export function RecordFormPage() {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [recordId, setRecordId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const loadExistingRecord = useCallback(async () => {
    setLoading(true);
    try {
      const record = await getRecordByBooking(bookingId);
      setRecordId(record.id);
      setNotes(record.notes);
    } catch {
      // No existing record for this booking yet — that's fine, this is a new record.
      setRecordId(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadExistingRecord();
  }, [loadExistingRecord]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      if (recordId) {
        await updateRecord(recordId, notes);
      } else {
        const record = await createRecord(bookingId, notes);
        setRecordId(record.id);
      }
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save the record."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Session Notes</h1>
        <p className="subtitle">
          Notes are encrypted before storage. Only you can read them.
        </p>

        {loading && <p>Loading...</p>}

        {!loading && (
          <form onSubmit={handleSubmit} className="dashboard-card">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder="Write session notes here..."
              required
              style={{
                width: "100%",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                padding: "0.75rem",
              }}
            />
            <button
              type="submit"
              disabled={saving}
              style={{ marginTop: "1rem" }}
            >
              {saving ? "Saving..." : recordId ? "Update Notes" : "Save Notes"}
            </button>
            {saved && (
              <p
                style={{ color: "var(--color-success)", marginTop: "0.75rem" }}
              >
                Saved successfully.
              </p>
            )}
            {error && (
              <div className="error-banner" role="alert">
                {error}
              </div>
            )}
          </form>
        )}

        <button
          onClick={() => navigate("/counselor")}
          style={{ marginTop: "1rem" }}
        >
          Back to Queue
        </button>
      </div>
    </div>
  );
}
