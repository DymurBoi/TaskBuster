import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, Typography, OutlinedInput, IconButton, Paper, InputAdornment } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CreateUser = ({ admin, setAdmin, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', admin: { adminId: admin.adminId } });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle user creation
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
        <div className="navbar-links">
          <Button onClick={() => navigate('/admin/dashboard')} sx={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', textTransform: 'none', fontSize: 16 }}>
            Dashboard
          </Button>
          <Button onClick={() => navigate('/admin/users')} sx={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', textTransform: 'none', fontSize: 16 }}>
            Users
          </Button>
          <Button onClick={() => navigate('/')} sx={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', textTransform: 'none', fontSize: 16 }}>
            Log Out
          </Button>
        </div>
      </nav>

      <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
            Create User
          </Typography>
          {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}

          <form onSubmit={handleCreateUser}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Name Input */}
              <OutlinedInput
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                sx={{ width: '100%' }}
                required
              />

              {/* Email Input */}
              <OutlinedInput
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                sx={{ width: '100%' }}
                required
              />

              {/* Password Input */}
              <Box sx={{ position: 'relative' }}>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '100%', bgcolor: '#fdcc01', color: 'black' }}
              >
                Create User
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default CreateUser;