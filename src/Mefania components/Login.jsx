// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/user/login?email=${email}&password=${password}`);
      const { userId, token } = response.data;

      // Save token and userId to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('loggedInUserId', userId);

      alert('Logged In Successfully!');
      onLogin(userId); // Pass userId to App
      navigate('/profile'); // Redirect to profile after login
    } catch (error) {
      console.error('Failed to log in:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="screen">
      <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </nav>

      <div className="screen">
        <div className="login-container">
          <h2 className="header">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
            <button type="submit" className="button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
