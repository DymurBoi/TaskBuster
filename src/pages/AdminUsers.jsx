import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Typography, TextField } from '@mui/material';
import Logo from "../assets/Logo1.png";
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
      {/* Navbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#091057"
        padding={2}
        color="white"
      >
        <img src={Logo} alt="Logo" style={{ maxWidth: "60px" }} />
        <Box display="flex" gap={3}>
          <Link to="/admin/dashboard">
            <Typography
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Dashboard
            </Typography>
          </Link>
          <Link to="/admin/profile">
            <Typography
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Profile
            </Typography>
          </Link>
          <Typography
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              fontWeight: "bold",
            }}
            onClick={handleLogout}
          >
            Logout
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Horizontally centers the content
          alignItems: 'center', // Vertically centers the content
 // Makes sure the content takes up the full height of the viewport
          padding: 2,
          m:6
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%', // Take up more horizontal space
            maxWidth: '1200px', // Increase the max width to make it bigger
            padding: 4,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 5,
          }}
        >
          <Typography variant="h3" fontWeight="bold" sx={{ color: 'black', marginBottom: 3 }}>
            Manage Users
          </Typography>

          {error && <Typography color="error" variant="body2">{error}</Typography>}

          {/* Search Bar */}
          <TextField
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: '100%',
              marginBottom: 3,
              marginTop: 2,
            }}
            variant="outlined"
          />

          {/* Create User Button */}
          <Button
            variant="contained"
            sx={{
              width: '100%',
              backgroundColor: 'primary',
              color: 'white',
              fontWeight: 'bold',
              marginBottom: 3,
              height: '50px', // Consistent button height
            }}
            onClick={() => navigate('/admin/create-user')}
          >
            Create User
          </Button>

          {/* Users Table */}
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
                marginBottom: 2,
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
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ display: 'flex', gap: '10px' }}>
                      {/* Edit Button */}
                      <Button
                        variant="contained"
                        sx={{
                          marginRight: 1,
                          color: 'white',
                          width: '120px', // Consistent width for buttons
                          height: '50px', // Consistent height for buttons
                        }}
                        onClick={() => navigate(`/admin/users/${user.userId}`)}
                      >
                        Edit
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          width: '120px', // Consistent width for buttons
                          height: '50px', // Consistent height for buttons
                        }}
                        onClick={() => handleDeleteUser(user.userId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AdminUsers;
