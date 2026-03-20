import React, { useState } from 'react'; // Fixes 'useState' if used
import axios from 'axios';               // Fixes 'axios' is not defined
import { useNavigate } from 'react-router-dom'; // Fixes 'navigate'

function Register() {
  // These declarations fix the 'username', 'email', etc., is not defined errors
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usertype, setUsertype] = useState('User');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Fixes 'navigate' is not defined

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:6001/register', {
        username, email, usertype, password
      });
      alert(response.data.message);
      navigate('/login');
    } catch (err) {
      // This check prevents the "Cannot read properties of undefined (reading 'data')" error
      const msg = err.response ? err.response.data.message : "Server not reachable";
      alert("Registration Failed: " + msg);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card p-4 shadow-sm" style={{ width: '400px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" className="form-control mb-3" 
            onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" className="form-control mb-3" 
            onChange={(e) => setEmail(e.target.value)} required />
          <select className="form-select mb-3" onChange={(e) => setUsertype(e.target.value)}>
            <option value="User">User</option>
            <option value="Operator">Flight Operator</option>
          </select>
          <input type="password" placeholder="Password" className="form-control mb-3" 
            onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;