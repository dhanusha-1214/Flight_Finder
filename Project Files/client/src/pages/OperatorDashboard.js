import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import API from "../utils/api";

/* ─── OPERATOR HOME ─── */
const OpHome = () => {
  const [stats, setStats] = useState({ flights: 0, bookings: 0 });
  const nav = useNavigate();

  useEffect(() => {
    API.get("/operator/stats").then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="page-inner">
      {/* Stat cards matching PDF: Bookings | Flights | New Flight */}
      <div className="op-grid">
        <div className="op-card">
          <div className="op-num">{stats.bookings}</div>
          <div className="op-label">Bookings</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("/operator/bookings")}>View all</button>
        </div>
        <div className="op-card">
          <div className="op-num">{stats.flights}</div>
          <div className="op-label">Flights</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("/operator/flights")}>View all</button>
        </div>
        <div className="op-card">
          <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>✈</div>
          <div className="op-label">New Flight</div>
          <div className="op-sub">(new route)</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("/operator/add-flight")}>Add now</button>
        </div>
      </div>
    </div>
  );
};

/* ─── ADD NEW FLIGHT — matches PDF form exactly ─── */
const CITIES = [
  "Select","Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata",
  "Pune","Ahmedabad","Jaipur","Goa","Dubai","London","Paris","New York",
  "Singapore","Tokyo","Sydney","Bangkok"
];

const AddFlight = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    flightName: "", flightId: "", origin: "Select", destination: "Select",
    departureTime: "", arrivalTime: "", totalSeats: 0, basePrice: 0
  });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/flights", {
        ...form,
        basePrice:  Number(form.basePrice),
        totalSeats: Number(form.totalSeats),
      });
      setSuccess("Flight added successfully!");
      setTimeout(() => nav("/operator/flights"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add flight.");
    } finally { setLoading(false); }
  };

  return (
    <div className="page-inner">
      {/* Matches PDF: centered "Add new Flight" form */}
      <div className="add-flight-wrap">
        <div className="add-flight-title">Add new Flight</div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="ff-grid">
            {/* Flight Name */}
            <div>
              <label className="ff-label">Flight Name</label>
              <input className="ff-input" placeholder="Indigo"
                value={form.flightName} onChange={e => setForm({ ...form, flightName: e.target.value })} required />
            </div>

            {/* Flight Id */}
            <div>
              <label className="ff-label">Flight Id</label>
              <input className="ff-input" placeholder="6E-201"
                value={form.flightId} onChange={e => setForm({ ...form, flightId: e.target.value })} required />
            </div>

            {/* Departure City (dropdown like PDF) */}
            <div>
              <label className="ff-label">Departure City</label>
              <select className="ff-input"
                value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Departure Time */}
            <div>
              <label className="ff-label">Departure Time</label>
              <input type="time" className="ff-input"
                value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} required />
            </div>

            {/* Destination City (dropdown like PDF) */}
            <div>
              <label className="ff-label">Destination City</label>
              <select className="ff-input"
                value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Arrival Time */}
            <div>
              <label className="ff-label">Arrival time</label>
              <input type="time" className="ff-input"
                value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} required />
            </div>

            {/* Total seats */}
            <div>
              <label className="ff-label">Total seats</label>
              <input type="number" className="ff-input" placeholder="0"
                value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })} required />
            </div>

            {/* Base price */}
            <div>
              <label className="ff-label">Base price</label>
              <input type="number" className="ff-input" placeholder="0"
                value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} required />
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button type="submit" className="btn btn-primary" style={{ minWidth: 120 }} disabled={loading}>
              {loading ? "Adding…" : "Add now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── OPERATOR BOOKINGS (all bookings for operator's flights) ─── */
const OpBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // Fetch all bookings for operator's flights via admin endpoint (operator sees their own)
    API.get("/operator/bookings").then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-inner">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20 }}>Bookings</h1>
      {bookings.length === 0 ? (
        <div className="empty"><div className="empty-icon">🎫</div><h3>No bookings yet for your flights</h3></div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(b => (
            <div key={b._id} className={`bk-card ${b.bookingStatus === "confirmed" ? "confirmed" : "cancelled"}`}>
              <div className="bk-line id"><strong>Booking ID:</strong> <span>{b._id}</span></div>
              <div className="bk-line">
                <strong>Mobile:</strong> <span>{b.mobile}</span>
                &nbsp;&nbsp;<strong>Email:</strong> <span>{b.email}</span>
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
                <span style={{ marginLeft: 14 }}><strong>Seats:</strong> {b.seats}</span>
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
                  <button className="btn btn-danger btn-sm">Cancel Ticket</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── OPERATOR FLIGHTS LIST ─── */
const OpFlights = () => {
  const [flights,  setFlights]  = useState([]);
  const [editF,    setEditF]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState({});
  const [msg,      setMsg]      = useState("");
  const nav = useNavigate();

  useEffect(() => {
    API.get("/operator/flights").then(r => setFlights(r.data)).finally(() => setLoading(false));
  }, []);

  const openEdit = (f) => {
    setEditF(f);
    setForm({ flightName: f.flightName, flightId: f.flightId, origin: f.origin, destination: f.destination, departureTime: f.departureTime, arrivalTime: f.arrivalTime, totalSeats: f.totalSeats, basePrice: f.basePrice });
    setMsg("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/flights/${editF._id}`, { ...form, basePrice: Number(form.basePrice), totalSeats: Number(form.totalSeats) });
      setMsg("Updated!"); setEditF(null);
      const res = await API.get("/operator/flights"); setFlights(res.data);
    } catch { setMsg("Update failed."); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-inner">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 className="section-title" style={{ fontSize: "1.4rem", margin: 0 }}>My Flights</h2>
        <button className="btn btn-primary btn-sm" onClick={() => nav("/operator/add-flight")}>+ Add Flight</button>
      </div>

      {flights.length === 0 ? (
        <div className="empty"><div className="empty-icon">✈️</div><h3>No flights added yet</h3></div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Flight Name</th><th>ID</th><th>Route</th>
                <th>Departure</th><th>Arrival</th><th>Seats</th><th>Price</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(f => (
                <tr key={f._id}>
                  <td style={{ fontWeight: 700 }}>{f.flightName}</td>
                  <td>{f.flightId}</td>
                  <td>{f.origin} → {f.destination}</td>
                  <td>{f.departureTime}</td>
                  <td>{f.arrivalTime}</td>
                  <td>{f.availableSeats ?? f.totalSeats}/{f.totalSeats}</td>
                  <td>${f.basePrice}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(f)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editF && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setEditF(null)}>
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.05rem" }}>Edit Flight</h2>
              <button onClick={() => setEditF(null)} style={{ border: "none", background: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--gray-400)" }}>×</button>
            </div>
            {msg && <div className="alert alert-success">{msg}</div>}
            <form onSubmit={handleUpdate}>
              <div className="ff-grid">
                {[
                  ["Flight Name","text","flightName","IndiGo"],
                  ["Flight ID","text","flightId","6E-201"],
                  ["Origin","text","origin","Delhi"],
                  ["Departure Time","time","departureTime",""],
                  ["Destination","text","destination","Mumbai"],
                  ["Arrival Time","time","arrivalTime",""],
                  ["Total Seats","number","totalSeats",""],
                  ["Base Price","number","basePrice",""],
                ].map(([lbl,type,key,ph]) => (
                  <div key={key}>
                    <label className="ff-label">{lbl}</label>
                    <input type={type} className="ff-input" placeholder={ph}
                      value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Update Flight</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── OPERATOR DASHBOARD WRAPPER ─── */
const OperatorDashboard = () => (
  <Routes>
    <Route index           element={<OpHome />} />
    <Route path="bookings" element={<OpBookings />} />
    <Route path="flights"  element={<OpFlights />} />
    <Route path="add-flight" element={<AddFlight />} />
  </Routes>
);

export default OperatorDashboard;
