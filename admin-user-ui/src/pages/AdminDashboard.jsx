import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleAdminProfile = () => {
    navigate('/admin/profile'); // Just navigate, admin data is already available as prop
  };

  const handleLogout = () => {
    localStorage.removeItem('admin'); // Clear admin data
    setAdmin(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!admin) return <p>Loading...</p>; // Show a loading state while retrieving admin info

  return (
    <div className="admin-dashboard">
      <header>
        <button className="logo-button" onClick={() => navigate('/')}>LOGO</button>
        <div className="header-right">
          <button onClick={handleAdminProfile}>View Profile</button>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Welcome {admin.name}!</p>
        <p>admin#{admin.adminId}</p>
        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
