import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, OutlinedInput, Typography, IconButton, Paper } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from "../assets/Logo1.png";

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
        <Link to="/">
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
          <Link to="/admin">
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
            Login
          </Typography>
          </Link>
        </Box>
      </Box>

      <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Box
          width="100%"
          maxWidth="400px"
          bgcolor="white"
          padding={4}
          borderRadius="8px"
          boxShadow={3}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center" // Center contents horizontally
        >
          <Typography component="span" variant="h4" fontWeight="bold">Admin Login</Typography>
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                <InputLabel htmlFor="email" sx={{ bgcolor: 'white' }}>Email</InputLabel>
                <OutlinedInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: '100%' }}
                  required
                />
              </FormControl>

              <Box sx={{ position: 'relative' }}>
                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ width: '100%' }}
                    required
                    id="outlined-adornment-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'hide the password' : 'display the password'}
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
                </FormControl>
              </Box>

              <Button type="submit" variant="contained" sx={{ width: '100%', bgcolor: '#primary', color: 'white' }}>
                Log In
              </Button>

              {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default AdminLoginPage;
