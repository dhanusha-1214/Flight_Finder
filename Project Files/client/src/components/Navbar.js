import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleLogout = () => { logout(); nav("/"); };

  // role-based brand suffix like PDF: "SB Flights (Admin)", "SB Flights (Operator)"
  const brandSuffix = user?.usertype === "admin"    ? " (Admin)"
                    : user?.usertype === "operator" ? " (Operator)"
                    : "";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        FlightFinder{brandSuffix}
      </Link>

      <ul className="navbar-nav">
        {/* TRAVELER links */}
        {(!user || user.usertype === "traveler") && (
          <li><Link to="/">Home</Link></li>
        )}

        {user?.usertype === "traveler" && <>
          <li><Link to="/bookings">Bookings</Link></li>
          <li>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ marginLeft: 4 }}>
              Logout
            </button>
          </li>
        </>}

        {/* ADMIN links: Home Users Bookings Flights Logout */}
        {user?.usertype === "admin" && <>
          <li><Link to="/admin">Home</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/bookings">Bookings</Link></li>
          <li><Link to="/admin/flights">Flights</Link></li>
          <li>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ marginLeft: 4 }}>
              Logout
            </button>
          </li>
        </>}

        {/* OPERATOR links: Home Bookings Flights Add Flight Logout */}
        {user?.usertype === "operator" && <>
          <li><Link to="/operator">Home</Link></li>
          <li><Link to="/operator/bookings">Bookings</Link></li>
          <li><Link to="/operator/flights">Flights</Link></li>
          <li><Link to="/operator/add-flight">Add Flight</Link></li>
          <li>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ marginLeft: 4 }}>
              Logout
            </button>
          </li>
        </>}

        {/* NOT LOGGED IN */}
        {!user && <>
          <li><Link to="/login">Login</Link></li>
        </>}
      </ul>
    </nav>
  );
};

export default Navbar;
