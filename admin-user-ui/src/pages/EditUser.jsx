import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = ({ admin, setAdmin, setIsLoggedIn }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // State variables to hold user data
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/read/${userId}`);
        setUser({
          name: response.data.name,
          email: response.data.email,
          password: response.data.password,
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data.');
      }
    };
    fetchUser();
  }, [userId]);

  // Handle user update
  const handleUpdate = async () => {
    const updatedUser = {
      name: user.name,
      email: user.email,
      password: user.password,
    };

    const confirmed = window.confirm('Are you sure you want to update this user?');
    if (confirmed) {
      try {
        await axios.put(`http://localhost:8080/api/user/putUser/${userId}`, updatedUser);
        alert('User updated successfully!');
        navigate('/admin/users');
      } catch (err) {
        console.error('Error updating user:', err);
        setError('Failed to update user.');
      }
    }
  };

  // Handle user deletion
  const confirmDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/user/delete/${userId}`);
        alert('User deleted');
        navigate('/admin/users');
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user.');
      }
    }
  };

  // Handle logout of admin
  const handleLogout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="edit-user">
      <header>
        <button className="logo-button" onClick={() => navigate('/')}>
          LOGO
        </button>
        <div className="header-right">
          <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
          {/* Displaying the admin info if available */}
          {admin && (
            <div>
              <button onClick={() => navigate('/admin/users')}>Users</button>
            </div>
          )}
        </div>
      </header>
      <div className="edit-user-container">
        <h2>Edit User</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="edit-user-form">
          <label>
            Name:
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </label>
          <div className="button-group">
            <button type="button" onClick={handleUpdate}>
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={confirmDelete}
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
