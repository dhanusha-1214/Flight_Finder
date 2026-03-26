import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

/* ─── ADMIN HOME (stats + operator applications) ─── */
const AdminHome = () => {
  const [stats, setStats] = useState({ users: 0, bookings: 0, flights: 0, pendingOperators: [] });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    API.get("/admin/stats").then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await API.put(`/admin/users/${id}/approve`);
    const res = await API.get("/admin/stats");
    setStats(res.data);
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-inner">
      {/* Stat cards: Users | Bookings | Flights — matches PDF exactly */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Users</div>
          <div className="stat-num">{stats.users}</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("/admin/users")}>View all</button>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings</div>
          <div className="stat-num">{stats.bookings}</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("/admin/bookings")}>View all</button>
        </div>
        <div className="stat-card">
          <div className="stat-label">Flights</div>
          <div className="stat-num">{stats.flights}</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("/admin/flights")}>View all</button>
        </div>
      </div>

      {/* New Operator Applications - matches PDF */}
      <div className="card card-body" style={{ marginTop: 4 }}>
        <div className="section-title">New Operator Applications</div>
        {stats.pendingOperators?.length === 0 ? (
          <p style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>No new requests..</p>
        ) : (
          stats.pendingOperators.map(op => (
            <div key={op._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--gray-100)" }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{op.username}</span>
                <span style={{ color: "var(--gray-400)", fontSize: "0.8rem", marginLeft: 10 }}>{op.email}</span>
              </div>
              <button className="btn btn-success btn-sm" onClick={() => handleApprove(op._id)}>Approve</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ─── ALL USERS PAGE (travelers + flight operators sections) ─── */
const AdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/users").then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const travelers = users.filter(u => u.usertype === "traveler");
  const operators = users.filter(u => u.usertype === "operator");

  return (
    <div className="page-inner">
      {/* "All Users" section — matches PDF */}
      <h2 className="section-title" style={{ fontSize: "1.4rem" }}>All Users</h2>
      {travelers.length === 0 ? (
        <p style={{ color: "var(--gray-400)", fontSize: "0.85rem", marginBottom: 20 }}>No traveler accounts yet.</p>
      ) : (
        <div style={{ marginBottom: 24 }}>
          {travelers.map(u => (
            <div key={u._id} className="item-row">
              <span><strong>UserId</strong> {u._id}</span>
              <span><strong>Username</strong> {u.username}</span>
              <span><strong>Email</strong> {u.email}</span>
            </div>
          ))}
        </div>
      )}

      {/* "Flight Operators" section — matches PDF */}
      <h2 className="section-title" style={{ fontSize: "1.4rem", marginTop: 8 }}>Flight Operators</h2>
      {operators.length === 0 ? (
        <p style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>No operator accounts yet.</p>
      ) : (
        <div>
          {operators.map(u => (
            <div key={u._id} className="item-row">
              <span><strong>Id</strong> {u._id}</span>
              <span><strong>Flight Name</strong> {u.username}</span>
              <span><strong>Email</strong> {u.email}</span>
              <span>
                <span className={`badge ${u.approval === "approved" ? "badge-green" : "badge-yellow"}`}>
                  {u.approval}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── ALL BOOKINGS PAGE — matches PDF booking card layout ─── */
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get("/admin/bookings").then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await API.put(`/bookings/${id}/cancel`);
    setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: "cancelled" } : b));
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-inner">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20 }}>Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty"><div className="empty-icon">🎫</div><h3>No bookings yet</h3></div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(b => (
            <div key={b._id} className={`bk-card ${b.bookingStatus === "confirmed" ? "confirmed" : "cancelled"}`}>
              <div className="bk-line id"><strong>Booking ID:</strong> <span>{b._id}</span></div>
              <div className="bk-line">
                <strong>Mobile:</strong> <span>{b.mobile}</span>
                &nbsp;&nbsp;<strong>Email:</strong> <span>{b.email || b.user?.email}</span>
              </div>
              <div className="bk-line">
                <strong>Flight Id:</strong> <span>{b.flightId}</span>
                &nbsp;&nbsp;<strong>Flight name:</strong> <span>{b.flightName}</span>
              </div>
              <div className="bk-line">
                <strong>On-boarding:</strong> <span>{b.departure}</span>
                &nbsp;&nbsp;<strong>Destination:</strong> <span>{b.destination}</span>
              </div>
              <div className="bk-line">
                <strong>Passengers:</strong>
                <span style={{ marginLeft: 16 }}><strong>Seats:</strong> {b.seats}</span>
              </div>
              {b.passengers?.length > 0 && (
                <ul style={{ listStyle: "none", padding: "2px 0 4px 12px" }}>
                  {b.passengers.map((p, i) => (
                    <li key={i} style={{ fontSize: "0.78rem", color: "var(--gray-600)" }}>
                      {i + 1}. Name: {p.name}, Age: {p.age}
                    </li>
                  ))}
                </ul>
              )}
              <div className="bk-line">
                <strong>Booking date:</strong>{" "}
                <span>{new Date(b.createdAt || b.bookingDate).toISOString().split("T")[0]}</span>
                &nbsp;&nbsp;<strong>Journey date:</strong>{" "}
                <span>{b.journeyDate ? new Date(b.journeyDate).toISOString().split("T")[0] : "—"}</span>
              </div>
              <div className="bk-line">
                <strong>Journey Time:</strong> <span>{b.journeyTime || "—"}</span>
                &nbsp;&nbsp;<strong>Total price:</strong> <span>{b.totalPrice}</span>
              </div>
              <div className="bk-line" style={{ marginTop: 4 }}>
                <strong>Booking status:</strong>{" "}
                <span className={b.bookingStatus === "confirmed" ? "bk-status-confirmed" : "bk-status-cancelled"}>
                  {b.bookingStatus}
                </span>
              </div>
              {b.bookingStatus === "confirmed" && (
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)}>
                    Cancel Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── ALL FLIGHTS PAGE ─── */
const AdminFlights = () => {
  const [flights,  setFlights]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get("/flights").then(r => setFlights(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;
    await API.delete(`/flights/${id}`);
    setFlights(flights.filter(f => f._id !== id));
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-inner">
      <h2 className="section-title" style={{ fontSize: "1.4rem" }}>All Flights</h2>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Flight Name</th><th>Flight ID</th><th>Route</th>
              <th>Departure</th><th>Arrival</th><th>Seats</th><th>Price</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flights.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--gray-400)", padding: 32 }}>No flights added yet</td></tr>
            ) : flights.map(f => (
              <tr key={f._id}>
                <td style={{ fontWeight: 700 }}>{f.flightName}</td>
                <td>{f.flightId}</td>
                <td>{f.origin} → {f.destination}</td>
                <td>{f.departureTime}</td>
                <td>{f.arrivalTime}</td>
                <td>{f.availableSeats ?? f.totalSeats}/{f.totalSeats}</td>
                <td>${f.basePrice}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(f._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── ADMIN DASHBOARD WRAPPER ─── */
const AdminDashboard = () => (
  <Routes>
    <Route index    element={<AdminHome />} />
    <Route path="users"    element={<AdminUsers />} />
    <Route path="bookings" element={<AdminBookings />} />
    <Route path="flights"  element={<AdminFlights />} />
  </Routes>
);

export default AdminDashboard;
