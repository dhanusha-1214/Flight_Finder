import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:6001/login', { email, password });
            alert("Login Successful!");
            
            // Store user data in local storage to keep them logged in
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Redirect based on user type (John would go to Home, Admin to Dashboard)
            if (response.data.user.usertype === 'Admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            alert("Login Failed: " + (err.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4" style={{ color: '#1a4f8b' }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" className="form-control mb-3" placeholder="Email address" 
                        onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" className="form-control mb-3" placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-primary w-100 py-2">Sign in</button>
                </form>
                <p className="text-center mt-3">
                    Not registered? <a href="/register" style={{ textDecoration: 'none' }}>Register</a>
                </p>
            </div>
        </div>
    );
}

export default Login;