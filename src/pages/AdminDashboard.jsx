import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import Logo from "../assets/Logo1.png";

const AdminDashboard = ({ admin, setIsLoggedIn, setAdmin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin)); // Restore admin data
      } else {
        setIsLoggedIn(false);
        navigate('/'); // Redirect to login if no admin data
      }
    }
  }, [admin, navigate, setAdmin, setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('admin'); // Clear admin data from local storage
    setAdmin(null);
    setIsLoggedIn(false);
    navigate('/'); // Navigate to the login page
  };

  if (!admin) return <p>Loading...</p>; // Show loading state while fetching admin info

  return (
    <div>
      {/* Header Section */}
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

      {/* Main Dashboard Content */}
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
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold" align="center" sx={{ marginBottom: 2 }}>
            Welcome, {admin.name}!
          </Typography>
          <Typography variant="body1" align="center" sx={{ marginBottom: 2 }}>
            Admin #{admin.adminId}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ width: '100%', bgcolor: 'primary', color: 'white' }}
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AdminDashboard;
