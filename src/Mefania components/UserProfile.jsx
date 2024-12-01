import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Paper, Typography, Container } from '@mui/material';
import Logo from "../assets/Logo1.png"

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false); // For confirmation dialog
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
    const token = localStorage.getItem('authToken');
    try {
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
    setConfirmDelete(false); // Close the confirmation dialog
  };


  if (!user) return <p>Loading...</p>;
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  }
  return (
    <div>
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#091057"
        padding={2}
        color="white"
      >
        <Link to="/todos">
         <Button sx={{ width: 'auto', mr: 1 }}><img src={Logo} alt="Logo" style={{ maxWidth: "60px" }} /></Button>
         </Link>
        <Box display="flex" gap={3}>
          <Link to="/todos">
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
              Home
            </Typography>
          </Link>
          <Link to="/profile">
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
          <Link to="/login">
            <Typography
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
              }}
              onClick={handleLogout}
            >
              Logout
            </Typography>
          </Link>
        </Box>
      </Box>
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
                  <Button onClick={handleUpdateUser} variant="contained" sx={{color:'white'}}>
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
                  <strong>Date Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap:2,pb:1 }}>
                  <Button onClick={() => setEditing(true)} variant="contained" sx={{color:'white'}}>
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
    <Box
        bgcolor="#091057"
        padding={3}
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="261px" // Pushes the footer to the bottom
      >
        <Box display="flex" gap={3} marginBottom={2}>
          <Typography component="button">
            <i className="fab fa-facebook" style={{ color: "white", fontSize: "20px" }}></i>
          </Typography>
          <Typography component="button">
            <i className="fab fa-instagram" style={{ color: "white", fontSize: "20px" }}></i>
          </Typography>
          <Typography component="button">
            <i className="fab fa-twitter" style={{ color: "white", fontSize: "20px" }}></i>
          </Typography>
        </Box>
        <Box display="flex" gap={3} fontFamily="Poppins" fontSize="14px">
          <Typography>Home</Typography>
          <Typography>About</Typography>
          <Typography>Team</Typography>
          <Typography>Services</Typography>
          <Typography>Contact</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default UserProfile;
