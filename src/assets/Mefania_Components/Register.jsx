import React, { useState } from 'react';
import { createUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './css.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      alert('User registered successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Failed to register user:', error);
      alert('Failed to register user. Please try again.');
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

      <div className="register-container">
        <h2 className="header">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="input"
          />
          <button type="submit" className="button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
