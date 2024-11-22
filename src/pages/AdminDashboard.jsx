import React, { useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Box, Button, Container, OutlinedInput, Typography, IconButton, Paper } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';

const AdminDashboard = ({ admin, setIsLoggedIn, setAdmin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin)); // Restore admin data
      } else {
        setIsLoggedIn(false);
        navigate('/'); // Redirect to login
      }
    }
  }, [admin, navigate, setAdmin, setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('admin'); // Clear admin data
    setAdmin(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!admin) return <p>Loading...</p>; // Show a loading state while retrieving admin info

  return (
    <div>
      <nav className="navbar">
        <Button
          startIcon={<ChecklistIcon />}
          sx={{ width: '10%', ml: 4, color: 'white', '& .MuiSvgIcon-root': { fontSize: 40 } }}
        >
          <h1 className="navbar-logo">TaskBuster</h1>
        </Button>
        <Box sx={{display: 'flex', flexDirection: 'row',gap:3,pb:0,pt:2}}>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/profile" className="nav-link">Profile</Link>
          <Button onClick={handleLogout} sx={{padding:0,pb:3.4,color:'white',fontFamily: 'Poppins, sans-serif', fontWeight: 'bold',textTransform: 'none',fontSize:15}}>Log Out</Button>
        </Box>
      </nav>
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Welcome {admin.name}!</p>
        <p>admin#{admin.adminId}</p>
        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
      </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
