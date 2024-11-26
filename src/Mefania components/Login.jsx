// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { TextField,Box, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './css.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Password validation regex
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError(
        'Password must be at least 8 characters and contain at least one special character.'
      );
    } else {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (passwordError) {
      alert('Please enter a valid password.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/login?email=${email}&password=${password}`
      );
      const { userId, token } = response.data;

      // Save token and userId to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('loggedInUserId', userId);

      alert('Logged In Successfully!');
      onLogin(userId); // Pass userId to App
      navigate('/todos'); // Redirect to profile after login
    } catch (error) {
      console.error('Failed to log in:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="screen">
      <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
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
        <Box sx={{ display: 'flex', flexDirection: 'row'}}>
          <Box sx={{mr:25,mt:25}}>
            <Typography variant='h2' sx={{fontWeight:'bold',color:'black'}}> TaskBuster</Typography>
            <Typography variant='h5' sx={{color:'black'}}>Organize all your tasks easily</Typography>
          </Box>
        <div className="login-container">
          <h2 className="header">Login</h2>
          <form onSubmit={handleLogin}>
            <Box sx={{pr:9}}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              sx={{ minWidth: 300 }}
              required
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            sx={{minWidth:300}}
            id="outlined-adornment-password"
            value={password}
            onChange={handlePasswordChange}
            type={showPassword ? 'text' : 'password'}
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
        </FormControl>
            </Box>
            {passwordError && <p className="error">{passwordError}</p>}
            <Button type="submit" variant='contained' sx={{width:200,height:50,margin:2}}>
              Login
            </Button>
          </form>
        </div>
        </Box>
      </div>
    </div>
  );
};

export default Login;
