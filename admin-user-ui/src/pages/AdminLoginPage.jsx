import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminLoginPage = ({ setIsLoggedIn, setAdmin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/taskbuster/admin/adminLogin', {
        email,
        password,
      });

      if (response.status === 200) {
        const adminData = response.data; // Assuming response contains admin details
        setAdmin(adminData);
        setIsLoggedIn(true);

        // Save admin data to localStorage
        localStorage.setItem('admin', JSON.stringify(adminData));

        // Navigate to the dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="admin-login">
      <header>
        <button className="logo-button" onClick={() => navigate('/')}>LOGO</button>
        <div className="header-right">
          <button onClick={() => navigate('/')}>Log In</button>
        </div>
      </header>
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="eye-icon"
            />
          </div>
          <button type="submit">Log In</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
