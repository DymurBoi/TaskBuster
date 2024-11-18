// CreateUser.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateUser = ({ admin, setAdmin, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', admin: { adminId: admin.adminId }});
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    try {
      await axios.post('http://localhost:8080/api/user/create', newUser);
      alert('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user.');
    }
  };

  return (
    <div className="create-user">
      <header>
        <button className="logo-button" onClick={() => navigate('/')}>
          LOGO
        </button>
        <div className="header-right">
          <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/admin/users')}>Users</button>
        </div>
      </header>
      <div className="createuser-container">
        <h2>Create User {admin?.adminId || ' '}</h2> {/* Display admin ID */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleCreateUser}>
          <label>
            Name:
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
          </label>
          <button type="submit" style={{ backgroundColor: '#fdcc01' }}>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
