import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Navbar } from "../components/Navbar";
import { AdminSidebar, type AdminSection } from "../components/AdminSidebar";
import { createSlot } from "../api/bookingAPI";
import {
  getCounselors,
  registerCounselor,
  type Counselor,
} from "../api/usersAPI";
import { getAuditLogs, type AuditLogEntry } from "../api/auditAPI";
import { getErrorMessage } from "../utils/errorUtils";
import "../pages/dashboard.css";

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [slotDatetime, setSlotDatetime] = useState("");
  const [creating, setCreating] = useState(false);
  const [slotCreated, setSlotCreated] = useState(false);

  const [newCounselorEmail, setNewCounselorEmail] = useState("");
  const [newCounselorName, setNewCounselorName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [counselorRegistered, setCounselorRegistered] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [counselorData, logData] = await Promise.all([
        getCounselors(),
        getAuditLogs(),
      ]);
      setCounselors(counselorData);
      setLogs(logData);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load admin data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount is a sanctioned useEffect pattern
    loadData();
  }, [loadData]);

  async function handleCreateSlot(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSlotCreated(false);
    setCreating(true);

    try {
      await createSlot(
        Number(selectedCounselor),
        new Date(slotDatetime).toISOString(),
      );
      setSlotCreated(true);
      setSlotDatetime("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create slot."));
    } finally {
      setCreating(false);
    }
  }

  async function handleRegisterCounselor(e: FormEvent) {
    e.preventDefault();
    setRegisterError("");
    setCounselorRegistered(false);
    setRegistering(true);

    try {
      await registerCounselor({
        email: newCounselorEmail,
        full_name: newCounselorName,
      });
      setCounselorRegistered(true);
      setNewCounselorEmail("");
      setNewCounselorName("");
      const updatedCounselors = await getCounselors();
      setCounselors(updatedCounselors);
    } catch (err) {
      setRegisterError(getErrorMessage(err, "Failed to register counselor."));
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <AdminSidebar active={activeSection} onSelect={setActiveSection} />

        <div className="admin-main">
          <h1>Admin Dashboard</h1>

          {loading && <p>Loading...</p>}
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {!loading && (
            <>
              {activeSection === "overview" && (
                <div className="dashboard-card">
                  <p className="subtitle">Overview</p>
                  <p>{counselors.length} counselor(s) registered.</p>
                  <p>
                    {logs.length} audit log entr
                    {logs.length === 1 ? "y" : "ies"}.
                  </p>
                </div>
              )}

              {activeSection === "counselors" && (
                <div className="dashboard-card">
                  <p className="subtitle">Register a counselor</p>
                  <form onSubmit={handleRegisterCounselor}>
                    <label htmlFor="counselorName">Full name</label>
                    <input
                      id="counselorName"
                      type="text"
                      value={newCounselorName}
                      onChange={(e) => setNewCounselorName(e.target.value)}
                      required
                    />

                    <label htmlFor="counselorEmail">Email</label>
                    <input
                      id="counselorEmail"
                      type="email"
                      value={newCounselorEmail}
                      onChange={(e) => setNewCounselorEmail(e.target.value)}
                      placeholder="counselor@example.com"
                      required
                    />

                    <button
                      type="submit"
                      disabled={registering}
                      style={{ marginTop: "1rem" }}
                    >
                      {registering ? "Registering..." : "Register Counselor"}
                    </button>

                    {counselorRegistered && (
                      <p
                        style={{
                          color: "var(--color-success)",
                          marginTop: "0.75rem",
                        }}
                      >
                        Counselor registered. They'll log in via OTP using their
                        email.
                      </p>
                    )}
                    {registerError && (
                      <div
                        className="error-banner"
                        role="alert"
                        style={{ marginTop: "0.75rem" }}
                      >
                        {registerError}
                      </div>
                    )}
                  </form>

                  {counselors.length > 0 && (
                    <>
                      <p className="subtitle" style={{ marginTop: "1.5rem" }}>
                        Existing counselors
                      </p>
                      <ul>
                        {counselors.map((c) => (
                          <li key={c.id}>{c.full_name || c.email}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeSection === "slots" && (
                <div className="dashboard-card">
                  <p className="subtitle">Create a session slot</p>
                  <form onSubmit={handleCreateSlot}>
                    <label htmlFor="counselor">Counselor</label>
                    <select
                      id="counselor"
                      value={selectedCounselor}
                      onChange={(e) => setSelectedCounselor(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.9rem",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <option value="">Select a counselor</option>
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name || c.email}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="datetime">Date &amp; time</label>
                    <input
                      id="datetime"
                      type="datetime-local"
                      value={slotDatetime}
                      onChange={(e) => setSlotDatetime(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      disabled={creating}
                      style={{ marginTop: "1rem" }}
                    >
                      {creating ? "Creating..." : "Create Slot"}
                    </button>
                    {slotCreated && (
                      <p
                        style={{
                          color: "var(--color-success)",
                          marginTop: "0.75rem",
                        }}
                      >
                        Slot created.
                      </p>
                    )}
                  </form>
                </div>
              )}

              {activeSection === "audit" && (
                <div className="dashboard-card">
                  <p className="subtitle">Audit log</p>
                  {logs.length === 0 ? (
                    <p>No audit entries yet.</p>
                  ) : (
                    <table
                      style={{
                        width: "100%",
                        fontSize: "0.85rem",
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
                          <th style={{ padding: "0.5rem 0" }}>Action</th>
                          <th>Role</th>
                          <th>Alias</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr
                            key={log.id}
                            style={{
                              borderTop: "1px solid var(--color-border)",
                            }}
                          >
                            <td style={{ padding: "0.5rem 0" }}>
                              {log.action}
                            </td>
                            <td>{log.actor_role}</td>
                            <td>{log.target_alias || "—"}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
