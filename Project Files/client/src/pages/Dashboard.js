import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const Dashboard = () => {
  const { user }  = useAuth();
  const [bks, setBks]   = useState([]);
  const [loading, setL] = useState(true);

  useEffect(() => {
    API.get("/bookings/my").then(r => setBks(r.data)).finally(() => setL(false));
  }, []);

  const confirmed = bks.filter(b => b.bookingStatus === "confirmed").length;
  const cancelled = bks.filter(b => b.bookingStatus === "cancelled").length;

  return (
    <div className="page-inner">
      <h1 className="pg-title">Welcome, {user?.username}!</h1>
      <p className="pg-sub">Manage your flights and bookings from here.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{bks.length}</div>
          <div className="stat-label">Total Bookings</div>
          <Link to="/bookings" className="btn btn-primary btn-sm">View all</Link>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--success)" }}>{confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--danger)" }}>{cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link to="/search" className="btn btn-primary btn-lg">✈ Search Flights</Link>
        <Link to="/bookings" className="btn btn-outline btn-lg">📋 My Bookings</Link>
      </div>

      <div className="card card-body">
        <div className="card-title">Recent Bookings</div>
        {loading ? <div className="spinner" /> :
          bks.length === 0 ? (
            <div className="empty" style={{ padding: 24 }}>
              <div className="empty-icon">🎫</div>
              <h3>No bookings yet</h3>
            </div>
          ) : bks.slice(0, 4).map(b => (
            <div key={b._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--gray-100)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{b.flightName} · {b.departure} → {b.destination}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-400)", marginTop: 2 }}>
                  {b.journeyDate ? new Date(b.journeyDate).toDateString() : "—"} · ₹{b.totalPrice}
                </div>
              </div>
              <span className={`badge ${b.bookingStatus === "confirmed" ? "badge-green" : "badge-red"}`}>
                {b.bookingStatus}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Dashboard;
