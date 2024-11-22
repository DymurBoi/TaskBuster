import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, Typography, TextField } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
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
    <div>
      <nav className="navbar">
        <Button
          startIcon={<ChecklistIcon />}
          sx={{
            width: '10%',
            ml: 4,
            color: 'white',
            '& .MuiSvgIcon-root': { fontSize: 40 },
          }}
        >
          <h1 className="navbar-logo">TaskBuster</h1>
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, pb: 0, pt: 2,pr:2 }}>
          <Link to="/admin/dashboard" className="nav-link">Home</Link>
          <Link to="/admin/profile" className="nav-link">Profile</Link>
          <Button
            onClick={handleLogout}
            sx={{
              padding: 0,
              pb: 3,
              color: 'white',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: 16,
            }}
          >
            Log Out
          </Button>
        </Box>
      </nav>
      <Container
  component="main"
  maxWidth="xl"
  sx={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8,
    paddiing:0// Optional: adjust padding as needed
  }}
>
  <div className="users-container">
    <Typography variant="h3" sx={{ color: 'black', fontFamily: 'Poppins, sans-serif' }}>
      Manage Users
    </Typography>
    {error && <p className="error-message">{error}</p>}

    {/* Search Bar */}
    <TextField
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
    <table
      style={{
        width: '100%', // Set the table width to 100% of the parent container
        tableLayout: 'fixed', // Optional: ensures columns are evenly distributed
        borderCollapse: 'collapse', // Optional: for cleaner borders
      }}
    >
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
            <td>
              <Typography sx={{ color: 'black', fontFamily: 'Poppins, sans-serif' }}>
                {user.userId}
              </Typography>
            </td>
            <td>
              <Typography sx={{ color: 'black', fontFamily: 'Poppins, sans-serif' }}>
                {user.name}
              </Typography>
            </td>
            <td>
              <Typography sx={{ color: 'black', fontFamily: 'Poppins, sans-serif' }}>
                {user.email}
              </Typography>
            </td>
            <td>
              <Typography sx={{ color: 'black', fontFamily: 'Poppins, sans-serif' }}>
                {user.createdAt}
              </Typography>
            </td>
            <td>
              <button onClick={() => navigate(`/admin/users/${user.userId}`)}>Edit</button>
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
</Container>

    </div>
  );
};

export default AdminUsers;
