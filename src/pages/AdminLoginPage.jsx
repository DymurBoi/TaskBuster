import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Container, OutlinedInput, Typography, IconButton, Paper } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AdminLoginPage = ({ setIsLoggedIn, setAdmin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/taskbuster/admin/adminLogin', {
        email,
        password,
      });

      if (response.status === 200) {
        const adminData = response.data; // Assuming response contains admin details
        setAdmin(adminData);
        setIsLoggedIn(true);

        // Save admin data to localStorage
        localStorage.setItem('admin', JSON.stringify(adminData));

        // Navigate to the dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Button
          startIcon={<ChecklistIcon />}
          sx={{ width: '10%', ml: 4, color: 'white', '& .MuiSvgIcon-root': { fontSize: 40 } }}
        >
          <h1 className="navbar-logo">TaskBuster</h1>
        </Button>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/admin" className="nav-link">Login</Link>
        </div>
      </nav>

      <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
          <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
            Admin Login
          </Typography>
          
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <OutlinedInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: '100%' }}
                required
              />
              
              <Box sx={{ position: 'relative' }}>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ width: '100%' }}
                  required
                  id="outlined-adornment-password"
                  endAdornment={
               <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
                />
              </Box>

              <Button type="submit" variant="contained" color="primary" sx={{ width: '100%',bgcolor:'#fdcc01',color:'black' }}>
                Log In
              </Button>
              
              {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLoginPage;
