import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", usertype: "traveler" });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/auth/register", form);
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => nav("/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="form-card">
        <div className="form-card-title" style={{ color: "var(--gray-900)" }}>Create Account</div>
        <div style={{ textAlign: "center", color: "var(--gray-500)", fontSize: "0.83rem", marginBottom: 20 }}>
          Join FlightFinder today
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" placeholder="John Doe"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-input" placeholder="name@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <div className="type-toggle">
              <button type="button" className={`type-btn ${form.usertype === "traveler" ? "active" : ""}`}
                onClick={() => setForm({ ...form, usertype: "traveler" })}>
                👤 Traveler
              </button>
              <button type="button" className={`type-btn ${form.usertype === "operator" ? "active" : ""}`}
                onClick={() => setForm({ ...form, usertype: "operator" })}>
                ✈ Operator
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ padding: "11px", fontSize: "0.9rem" }} disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.83rem", color: "var(--gray-500)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
