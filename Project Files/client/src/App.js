import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import "./styles/global.css";

/* Route guard */
const Guard = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.usertype)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"        element={<Home />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search"  element={<Search />} />

          {/* Traveler */}
          <Route path="/dashboard" element={<Guard roles={["traveler"]}><Dashboard /></Guard>} />
          <Route path="/bookings"  element={<Guard roles={["traveler"]}><Bookings /></Guard>} />

          {/* Admin — nested routes handled inside AdminDashboard */}
          <Route path="/admin/*" element={<Guard roles={["admin"]}><AdminDashboard /></Guard>} />

          {/* Operator — nested routes handled inside OperatorDashboard */}
          <Route path="/operator/*" element={<Guard roles={["operator"]}><OperatorDashboard /></Guard>} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>✈️</div>
              <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Page Not Found</h2>
              <p style={{ color: "var(--gray-500)", marginBottom: 20 }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
