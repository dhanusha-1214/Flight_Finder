import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const CLASS_MULT = { economy: 1, business: 2.5, first: 4 };

const BookingModal = ({ flight, onClose, onBooked }) => {
  const { user }  = useAuth();
  const [cls,     setCls]     = useState("economy");
  const [seats,   setSeats]   = useState(1);
  const [mobile,  setMobile]  = useState("");
  const [pax,     setPax]     = useState([{ name: "", age: "" }]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const unitPrice = Math.round((flight.basePrice || 200) * CLASS_MULT[cls]);
  const total     = unitPrice * seats;

  const updatePax = (i, k, v) => {
    const u = [...pax]; u[i][k] = v; setPax(u);
  };

  const handleSeats = (n) => {
    const num = Math.max(1, Math.min(9, parseInt(n) || 1));
    setSeats(num);
    setPax(prev => Array.from({ length: num }, (_, i) => prev[i] || { name: "", age: "" }));
  };

  // Generate seat codes: E-1, E-2 / B-1, B-2 / F-1
  const seatCodes = Array.from({ length: seats }, (_, i) =>
    `${cls[0].toUpperCase()}-${i + 1}`
  ).join(", ");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/bookings", {
        flightDbId:  flight._id,
        flightId:    flight.flightId,
        flightName:  flight.flightName,
        departure:   flight.origin,
        destination: flight.destination,
        email:       user.email,
        mobile,
        seats:       seatCodes,
        passengers:  pax.map(p => ({ name: p.name, age: Number(p.age) })),
        totalPrice:  total,
        journeyDate: new Date().toISOString(),
        journeyTime: flight.departureTime,
        seatClass:   cls,
      });
      onBooked();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.05rem" }}>Book Flight</h2>
          <button onClick={onClose}
            style={{ border: "none", background: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--gray-400)", lineHeight: 1 }}>
            ×
          </button>
        </div>

        {/* Flight summary */}
        <div style={{ background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>
            {flight.flightName} · {flight.flightId}
          </div>
          <div style={{ color: "var(--gray-500)", fontSize: "0.82rem", marginBottom: 6 }}>
            {flight.origin} → {flight.destination} &nbsp;|&nbsp; {flight.departureTime} – {flight.arrivalTime}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>
              ₹{unitPrice} × {seats} seat(s) · {cls}
            </span>
            <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.05rem" }}>
              Total: ₹{total}
            </span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Seat class toggle */}
          <div className="form-group">
            <label>Seat Class</label>
            <div className="type-toggle">
              {Object.keys(CLASS_MULT).map(c => (
                <button key={c} type="button"
                  className={`type-btn ${cls === c ? "active" : ""}`}
                  onClick={() => setCls(c)}
                  style={{ textTransform: "capitalize" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Seats + Mobile */}
          <div className="g2" style={{ gap: 12, marginBottom: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Number of Seats</label>
              <input type="number" min="1" max="9" className="form-input-plain"
                value={seats} onChange={e => handleSeats(e.target.value)} required />
              <div style={{ fontSize: "0.72rem", color: "var(--gray-400)", marginTop: 3 }}>
                Seats: {seatCodes}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Mobile Number</label>
              <input className="form-input-plain" placeholder="9876543210"
                value={mobile} onChange={e => setMobile(e.target.value)} required />
            </div>
          </div>

          {/* Passenger details */}
          <div className="form-group">
            <label>Passenger Details</label>
            {pax.map((p, i) => (
              <div key={i} style={{
                background: "var(--gray-50)", borderRadius: 8, padding: "10px 12px",
                marginBottom: 8, border: "1px solid var(--gray-200)"
              }}>
                <div style={{ fontSize: "0.7rem", color: "var(--gray-400)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Passenger {i + 1}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    className="form-input-plain"
                    placeholder="Full Name"
                    value={p.name}
                    onChange={e => updatePax(i, "name", e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number" min="1" max="120"
                    className="form-input-plain"
                    placeholder="Age"
                    value={p.age}
                    onChange={e => updatePax(i, "age", e.target.value)}
                    required
                    style={{ width: 80 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Confirm button */}
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 4 }}
            disabled={loading}
          >
            {loading ? "Confirming…" : `Confirm Booking — ₹${total}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
