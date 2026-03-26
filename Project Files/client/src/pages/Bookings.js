import React, { useState, useEffect } from "react";
import API from "../utils/api";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch { } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: "cancelled" } : b));
    } catch { alert("Could not cancel booking."); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-inner">
      {/* Title matching PDF: "Bookings" heading */}
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20, color: "var(--gray-900)" }}>
        Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎫</div>
          <h3>No bookings yet</h3>
          <p style={{ fontSize: "0.83rem", marginTop: 4 }}>Search for flights and make your first booking!</p>
        </div>
      ) : (
        /* PDF shows 2-column grid of booking cards */
        <div className="bookings-grid">
          {bookings.map(b => (
            <div
              key={b._id}
              className={`bk-card ${b.bookingStatus === "confirmed" ? "confirmed" : "cancelled"}`}
            >
              {/* Booking ID */}
              <div className="bk-line id">
                <strong>Booking ID:</strong> <span>{b._id}</span>
              </div>

              {/* Mobile + Email */}
              <div className="bk-line">
                <strong>Mobile:</strong> <span>{b.mobile}</span>
                &nbsp;&nbsp;
                <strong>Email:</strong> <span>{b.email}</span>
              </div>

              {/* Flight ID + Flight name */}
              <div className="bk-line">
                <strong>Flight Id:</strong> <span>{b.flightId}</span>
                &nbsp;&nbsp;
                <strong>Flight name:</strong> <span>{b.flightName}</span>
              </div>

              {/* On-boarding + Destination */}
              <div className="bk-line">
                <strong>On-boarding:</strong> <span>{b.departure}</span>
                &nbsp;&nbsp;
                <strong>Destination:</strong> <span>{b.destination}</span>
              </div>

              {/* Passengers */}
              <div className="bk-line">
                <strong>Passengers:</strong>
                <span style={{ marginLeft: 16 }}><strong>Seats:</strong> {b.seats}</span>
              </div>
              {b.passengers?.length > 0 && (
                <ul className="pax-list" style={{ listStyle: "none", padding: 0 }}>
                  {b.passengers.map((p, i) => (
                    <li key={i} style={{ fontSize: "0.78rem", color: "var(--gray-600)" }}>
                      {i + 1}. Name: {p.name}, Age: {p.age}
                    </li>
                  ))}
                </ul>
              )}

              {/* Booking date + Journey date */}
              <div className="bk-line">
                <strong>Booking date:</strong>{" "}
                <span>{new Date(b.createdAt || b.bookingDate).toISOString().split("T")[0]}</span>
                &nbsp;&nbsp;
                <strong>Journey date:</strong>{" "}
                <span>{b.journeyDate ? new Date(b.journeyDate).toISOString().split("T")[0] : "—"}</span>
              </div>

              {/* Journey time + Total price */}
              <div className="bk-line">
                <strong>Journey Time:</strong> <span>{b.journeyTime || "—"}</span>
                &nbsp;&nbsp;
                <strong>Total price:</strong> <span>{b.totalPrice}</span>
              </div>

              {/* Booking status */}
              <div className="bk-line" style={{ marginTop: 4 }}>
                <strong>Booking status:</strong>{" "}
                <span className={b.bookingStatus === "confirmed" ? "bk-status-confirmed" : "bk-status-cancelled"}>
                  {b.bookingStatus}
                </span>
              </div>

              {/* Cancel button - only for confirmed */}
              {b.bookingStatus === "confirmed" && (
                <div style={{ marginTop: 10 }}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(b._id)}
                  >
                    Cancel Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stub rows at bottom like PDF (additional booking IDs shown partially) */}
      {bookings.length > 0 && bookings.length < 4 && (
        <div style={{ marginTop: 14 }}>
          {/* PDF shows extra booking ID stubs at bottom */}
        </div>
      )}
    </div>
  );
};

export default Bookings;
