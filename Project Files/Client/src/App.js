import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark px-4" style={{ backgroundColor: '#1a4f8b' }}>
        <Link className="navbar-brand fw-bold" to="/">SB Flights</Link>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link text-white" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/register">Register</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link text-white" to="/bookings">My Bookings</Link></li>
                <li className="nav-item"><span className="nav-link text-warning">Hi, {user.username}</span></li>
                <li className="nav-item"><button className="btn nav-link text-white border-0" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </Router>
  );
}

export default App;