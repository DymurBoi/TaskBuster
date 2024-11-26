// src/components/Register.jsx
import React, { useState } from 'react';
import { createUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Box, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Paper, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import Button from '@mui/material/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      // Password validation regex
      const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(value)) {
        setPasswordError('Password must be at least 8 characters and contain at least one special character.');
      } else {
        setPasswordError('');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation (similar to your Login)
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        'Password must be at least 8 characters and contain at least one special character.'
      );
      return;
    } else {
      setPasswordError('');
    }

    try {
      await createUser(formData);
      alert('User registered successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Failed to register user:', error);
      alert('Failed to register user. Please try again.');
    }
  };

  return (
    <div>
      <nav className="navbar">
      <Button
          startIcon={<ChecklistIcon />}
          sx={{width:'10%',ml:4,color:'white','& .MuiSvgIcon-root': { fontSize: 40 }}}
          ><h1 className="navbar-logo">TaskBuster</h1>
          </Button>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </div>
      </nav>
      <div className="screen">
        <Paper elevation={3} className="register-container"> {/* Paper component with elevation */}
          <h2 className="header">Register</h2>
          <form onSubmit={handleSubmit}>
            <Box sx={{ pr: 6 }}>
              {/* Name Field */}
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="name">Name</InputLabel>
                <OutlinedInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Name"
                  required
                  sx={{ minWidth: 300 }}
                />
              </FormControl>

              {/* Email Field */}
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  required
                  sx={{ minWidth: 300 }}
                />
              </FormControl>

              {/* Password Field */}
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  required
                  sx={{ minWidth: 300 }}
                />
              </FormControl>
            </Box>
            {passwordError && <p className="error">{passwordError}</p>}
            <Button type="submit" sx={{width:300,bgcolor:'#B4BB85',color:'white','&:hover': { bgcolor:'#969c6e'}}}>Register</Button>
          </form>
          <Typography sx={{mt:2}}>Already signed up? <Link>Go to login</Link></Typography>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
