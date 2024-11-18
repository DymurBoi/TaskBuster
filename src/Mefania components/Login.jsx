// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { TextField } from '@mui/material';
import './css.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Password validation regex
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError(
        'Password must be at least 8 characters and contain at least one special character.'
      );
    } else {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (passwordError) {
      alert('Please enter a valid password.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/login?email=${email}&password=${password}`
      );
      const { userId, token } = response.data;

      // Save token and userId to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('loggedInUserId', userId);

      alert('Logged In Successfully!');
      onLogin(userId); // Pass userId to App
      navigate('/todos'); // Redirect to profile after login
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
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
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
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="input"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            {passwordError && <p className="error">{passwordError}</p>}
            <button type="submit" className="button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
