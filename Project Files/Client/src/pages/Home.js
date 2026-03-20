import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:6001/all-flights').then(res => setFlights(res.data));
  }, []);

  const origins = [...new Set(flights.map(f => f.origin))];
  const destinations = [...new Set(flights.map(f => f.destination))];

  const handleSearch = () => {
    const filtered = flights.filter(f => f.origin === origin && f.destination === dest);
    setResults(filtered);
  };

  const handleBook = async (flightId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please login to book!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:6001/book-flight', {
        userId: user._id,
        flightId: flightId
      });
      alert(response.data.message);
    } catch (err) {
      alert("Booking Failed: Server Error");
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section text-white d-flex align-items-center" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1500&q=80")',
        backgroundSize: 'cover', height: '60vh', width: '100%'
      }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Find Your Next Adventure</h1>
          <div className="bg-white p-4 rounded shadow text-dark d-flex gap-3 justify-content-center flex-wrap mt-4">
            <select className="form-select" style={{width: '200px'}} onChange={(e) => setOrigin(e.target.value)}>
              <option value="">Departure City</option>
              {origins.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select" style={{width: '200px'}} onChange={(e) => setDest(e.target.value)}>
              <option value="">Destination City</option>
              {destinations.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary px-5" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        {results.length > 0 && <h3 className="mb-4 text-dark">Available Flights</h3>}
        {results.map(f => (
          <div key={f._id} className="card p-3 mb-3 shadow-sm border-0 bg-light">
            <div className="row align-items-center text-dark">
              <div className="col-md-3"><strong>{f.flightName}</strong><br/><small>{f.flightId}</small></div>
              <div className="col-md-3"><strong>{f.departureTime}</strong><br/>{f.origin}</div>
              <div className="col-md-3"><strong>{f.arrivalTime}</strong><br/>{f.destination}</div>
              <div className="col-md-2 text-primary fw-bold">₹{f.basePrice}</div>
              <div className="col-md-1"><button className="btn btn-success" onClick={() => handleBook(f._id)}>Book</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;