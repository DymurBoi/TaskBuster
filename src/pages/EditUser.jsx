import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, Typography, OutlinedInput, IconButton, Paper, InputAdornment } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
  const [showPassword, setShowPassword] = useState(false);

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

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

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

      <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
            Edit User
          </Typography>
          {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}
          
          <form onSubmit={(e) => e.preventDefault()}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Name Input */}
              <OutlinedInput
                type="text"
                placeholder="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                sx={{ width: '100%' }}
                required
              />
              
              {/* Email Input */}
              <OutlinedInput
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                sx={{ width: '100%' }}
                required
              />
              
              {/* Password Input */}
              <Box sx={{ position: 'relative' }}>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  sx={{ width: '100%' }}
                  required
                  id="outlined-adornment-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>

              {/* Buttons */}
              <Button
                variant="contained"
                color="primary"
                sx={{ width: '100%', bgcolor: '#fdcc01', color: 'black' }}
                onClick={handleUpdate}
              >
                Save Changes
              </Button>
              
              <Button
                variant="contained"
                color="error"
                sx={{ width: '100%' }}
                onClick={confirmDelete}
              >
                Delete Account
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default EditUser;