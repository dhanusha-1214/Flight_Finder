import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      const type = res.data.user.usertype;
      if (type === "admin")    nav("/admin");
      else if (type === "operator") nav("/operator");
      else nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally { setLoading(false); }
  };

  return (
    /* full-page light background matching PDF */
    <div style={{ minHeight: "calc(100vh - 52px)", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="form-card">
        {/* Title styled in blue like PDF */}
        <div className="form-card-title">Login</div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email" className="form-input"
              placeholder=""
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" className="form-input"
              placeholder=""
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ padding: "11px", fontSize: "0.9rem", marginTop: 4 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.83rem", color: "var(--gray-500)" }}>
          Not registered?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
