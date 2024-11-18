import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUsers = ({ admin, setAdmin, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/all');
      setUsers(response.data);
      setFilteredUsers(response.data); // Set initial filtered users
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users.');
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/user/delete/${id}`);
        alert('User deleted');
        fetchUsers(); // Re-fetch the user list after deletion
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <div className="admin-users">
      <header>
        <button className="logo-button" onClick={() => navigate('/')}>
          LOGO
        </button>
        <div className="header-right">
          <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
          {/* Add the Logout button in the header */}
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>
      <div className="users-container">
        <h1>Manage User</h1>
        {error && <p className="error-message">{error}</p>}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {/* Create User Button */}
        <button
          className="create-user-btn"
          onClick={() => navigate('/admin/create-user')}
          style={{ backgroundColor: '#fdcc01' }}
        >
          Create User
        </button>

        {/* Users Table */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>
                  <button onClick={() => navigate(`/admin/users/${user.userId}`)}>
                    Edit
                  </button>
                  <button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={() => handleDeleteUser(user.userId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
