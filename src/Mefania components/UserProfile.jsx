import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Paper, Typography, Container } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';

import './css.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('loggedInUserId');

    if (!token || !userId) {
      alert('Please log in to view your profile.');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/read/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setPassword(response.data.password);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        alert('Failed to fetch user data.');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:8080/api/user/update?id=${user.userId}`,
        { ...user, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditing(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/user/delete/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully!');
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedInUserId');
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const handleViewToDoList = () => {
    navigate('/todos');
  };

  const handleAddToDoList = () => {
    navigate('/todos/new');
  };

  if (!user) return <p>Loading...</p>;
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  }
  return (
    <div>
        <nav className="navbar">
          <Button
          startIcon={<ChecklistIcon />}
          sx={{width:'10%',ml:4,color:'white','& .MuiSvgIcon-root': { fontSize: 41 }}}
          ><h1 className="navbar-logo">TaskBuster</h1>
          </Button>
          <div className="navbar-links">
            <Link to="/todos" className="nav-link">Todos</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
          </div>
        </nav>
    <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              {user.name}'s Profile
            </Typography>

            {editing ? (
              <div>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between',gap:2.5,pb:2 }}>
                  <Button onClick={handleUpdateUser} variant="contained" color="primary">
                    Save
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Box>
              </div>
            ) : (
              <div>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {user.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Date Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap:2,pb:1 }}>
                  <Button onClick={() => setEditing(true)} variant="contained" sx={{bgcolor:'#fdcc01'}}>
                    Edit
                  </Button>
                  <Button onClick={handleDeleteUser} variant="contained" color="error">
                    Delete Account
                  </Button>
                </Box>
              </div>
            )}
          </Paper>
        </Box>
    </Container>
    </div>
  );
};

export default UserProfile;
