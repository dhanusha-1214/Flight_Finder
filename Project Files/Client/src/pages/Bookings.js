import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bookings() {
    const [myBookings, setMyBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:6001/user-bookings/${user._id}`)
                .then(res => setMyBookings(res.data))
                .catch(err => console.log(err));
        }
    }, [user._id]);

    return (
        <div className="container mt-5 text-dark">
            <h2 className="mb-4">My Confirmed Tickets</h2>
            {myBookings.length > 0 ? (
                myBookings.map((b, i) => (
                    <div key={i} className="card p-3 mb-3 shadow-sm border-start border-success border-4">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <h5>{b.flight?.flightName}</h5>
                                <small className="text-muted">Flight ID: {b.flight?.flightId}</small>
                            </div>
                            <div className="col-md-4">
                                <strong>{b.flight?.origin}</strong> to <strong>{b.flight?.destination}</strong><br/>
                                <small>{b.flight?.departureTime}</small>
                            </div>
                            <div className="col-md-4 text-end">
                                <span className="badge bg-success p-2">Status: {b.status}</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="alert alert-warning">You haven't booked any flights yet.</div>
            )}
        </div>
    );
}

export default Bookings;