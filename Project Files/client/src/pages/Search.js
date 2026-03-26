import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import BookingModal from "../components/BookingModal";

const CITIES = [
  "Select","Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata",
  "Pune","Ahmedabad","Jaipur","Goa","Dubai","London","Paris","New York",
  "Singapore","Tokyo","Sydney","Bangkok","Kuala Lumpur"
];

const Search = () => {
  const [sp]         = useSearchParams();
  const nav          = useNavigate();
  const { user }     = useAuth();
  const [from,     setFrom]     = useState(sp.get("from") || "Select");
  const [to,       setTo]       = useState(sp.get("to")   || "Select");
  const [date,     setDate]     = useState(sp.get("date") || "");
  const [flights,  setFlights]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (sp.get("from") || sp.get("to")) doSearch();
    // eslint-disable-next-line
  }, []);

  const doSearch = async () => {
    setLoading(true); setSearched(true);
    try {
      const res = await API.get(`/flights/search?origin=${from}&destination=${to}`);
      setFlights(res.data);
    } catch { setFlights([]); }
    finally { setLoading(false); }
  };

  const handleBook = (f) => {
    if (!user) { nav("/login"); return; }
    setSelected(f);
  };

  return (
    <div className="page-inner">
      <h1 className="pg-title">Search Flights</h1>

      {/* Search bar */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginBottom: 4 }}>Departure City</div>
            <select className="form-input-plain" style={{ minWidth: 160 }} value={from} onChange={e => setFrom(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginBottom: 4 }}>Destination City</div>
            <select className="form-input-plain" style={{ minWidth: 160 }} value={to} onChange={e => setTo(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginBottom: 4 }}>Journey date</div>
            <input type="date" className="form-input-plain" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={doSearch}>Search</button>
        </div>
      </div>

      {loading && <div className="spinner" />}

      {!loading && searched && flights.length === 0 && (
        <div className="empty">
          <div className="empty-icon">✈️</div>
          <h3>No flights found</h3>
          <p style={{ fontSize: "0.83rem", marginTop: 4 }}>Try different cities or check available routes</p>
        </div>
      )}

      {!loading && flights.map(f => (
        <div key={f._id} className="flight-card">
          <div style={{ minWidth: 150 }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{f.flightName}</div>
            <div style={{ color: "var(--gray-400)", fontSize: "0.75rem" }}>Flight {f.flightId}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{f.departureTime}</div>
              <div style={{ color: "var(--gray-400)", fontSize: "0.75rem" }}>{f.origin}</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: "0.72rem", color: "var(--gray-400)" }}>Direct</div>
              <div style={{ width: "100%", height: 1, background: "var(--gray-200)", position: "relative" }}>
                <span style={{ position: "absolute", right: "48%", top: -8, fontSize: "0.9rem" }}>✈</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{f.arrivalTime}</div>
              <div style={{ color: "var(--gray-400)", fontSize: "0.75rem" }}>{f.destination}</div>
            </div>
          </div>
          <div style={{ textAlign: "right", marginLeft: "auto" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)" }}>${f.basePrice}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--gray-400)", marginBottom: 8 }}>per person</div>
            <button className="btn btn-primary btn-sm" onClick={() => handleBook(f)}>Book Now</button>
          </div>
        </div>
      ))}

      {selected && (
        <BookingModal
          flight={selected}
          onClose={() => setSelected(null)}
          onBooked={() => { setSelected(null); nav("/bookings"); }}
        />
      )}
    </div>
  );
};

export default Search;
