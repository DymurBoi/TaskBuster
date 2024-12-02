import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import Logo from "../assets/Logo1.png";

const AdminProfile = ({ admin, setIsLoggedIn, setAdmin }) => {
  const navigate = useNavigate();

  if (!admin) {
    navigate('/'); // Redirect if admin data is missing
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin'); // Clear admin data
    setAdmin(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  const confirmDelete = () => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      // Delete account logic
    }
  };

  return (
    <div><Box
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      {/* Header */}
      

      {/* Back Button */}
      <Box sx={{ width: '100%', paddingLeft: 2, marginTop: 2 }}>
        <Button
          variant="text"
          sx={{
            fontSize: '16px',
            color: '#091057',
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/admin/dashboard')}
        >
          &lt; Back
        </Button>
      </Box>

      {/* Profile Section */}
      <Paper
        sx={{
          width: '80%',
          maxWidth: '900px',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
          marginTop: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
          Admin Profile
        </Typography>

        {/* Admin Info */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            Name and Email
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <strong>Name:</strong> {admin.name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {admin.email}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            Admin ID and Date Joined
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <strong>Admin ID:</strong> {admin.adminId}
          </Typography>
          <Typography>
            <strong>Date Joined:</strong> {admin.createdAt || 'N/A'}
          </Typography>
        </Box>

        {/* Admin Privileges */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            Privileges
          </Typography>
          <Typography>
            {admin.privileges || 'Full Access, User Management'} {/* Replace dynamically */}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            sx={{ width: '200px', fontWeight: 'bold' }}
            onClick={confirmDelete}
          >
            Delete Account
          </Button>

          <Button
            variant="contained"
            sx={{ width: '200px', fontWeight: 'bold' }}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Box>
      </Paper>
    </Box>
    </div>
  );
};

export default AdminProfile;
