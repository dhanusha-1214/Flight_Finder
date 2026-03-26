import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CITIES = [
  "Select","Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata",
  "Pune","Ahmedabad","Jaipur","Goa","Dubai","London","Paris","New York",
  "Singapore","Tokyo","Sydney","Bangkok","Kuala Lumpur"
];

const Home = () => {
  const nav = useNavigate();
  const [returnJourney, setReturnJourney] = useState(false);
  const [from, setFrom] = useState("Select");
  const [to,   setTo]   = useState("Select");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    nav(`/search?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-img" />
        <div className="hero-content">
          <h1 className="hero-title">
            Embark on an<br />
            Extraordinary Flight<br />
            Booking Adventure!
          </h1>
          <p className="hero-subtitle">
            Unleash your travel desires and book extraordinary Flight journeys that will transport
            you to unforgettable destinations, igniting a sense of adventure like never before.
          </p>

          {/* Return journey toggle */}
          <div className="return-row">
            <div
              className={`toggle-switch ${returnJourney ? "on" : ""}`}
              onClick={() => setReturnJourney(!returnJourney)}
            />
            <span className="toggle-label">Return journey</span>
          </div>

          {/* Search bar */}
          <div className="search-row">
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginBottom: 4 }}>
                Departure City
              </div>
              <select
                className="search-select"
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginBottom: 4 }}>
                Destination City
              </div>
              <select
                className="search-select"
                value={to}
                onChange={e => setTo(e.target.value)}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginBottom: 4 }}>
                Journey date
              </div>
              <input
                type="date"
                className="search-date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div style={{ paddingTop: 20 }}>
              <button className="btn btn-primary btn-lg" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <div className="page-inner">
        <h2 className="section-title" style={{ marginBottom: 18 }}>Popular Destinations</h2>
        <div className="g3" style={{ gap: 16, marginBottom: 32 }}>
          {[
            { city: "Paris",    price: "From $450", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80" },
            { city: "New York", price: "From $320", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
            { city: "Tokyo",    price: "From $890", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },
          ].map(d => (
            <div
              key={d.city}
              onClick={() => nav(`/search?to=${d.city}`)}
              style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "var(--shadow)" }}
            >
              <img src={d.img} alt={d.city} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px", color: "#fff" }}>
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{d.city}</div>
                <div style={{ color: "#4ade80", fontWeight: 600, fontSize: "0.85rem" }}>{d.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── WHY FLIGHTFINDER ── */}
        <div className="g3" style={{ gap: 16 }}>
          {[
            { icon: "⚡", title: "Instant Booking", desc: "Book your flight in seconds with our simple and fast booking process." },
            { icon: "💰", title: "Best Prices",     desc: "Find unbeatable fares with price comparison across hundreds of airlines." },
            { icon: "🛡️", title: "Safe & Secure",   desc: "Your payments and personal data are always protected." },
          ].map(f => (
            <div key={f.title} className="card card-body" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "var(--gray-500)", fontSize: "0.83rem" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
