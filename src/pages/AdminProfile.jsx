import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="admin-profile">
      <header>
        <button className="logo-button" onClick={() => navigate('/')}>LOGO</button>
        <div className="header-right">
          <button onClick={() => navigate('/admin/dashboard/')}>Dashboard</button>
        </div>
      </header>
      <div className="back-container">
        <button className="back-button" onClick={() => navigate('/admin/dashboard')}>&lt; Back</button>
      </div>
      <br />
      <div className="admin-profile-container">
        <div className="admin-info">
          <div className="name-email-container">
            <div className="profile-text">
              <strong>Name:</strong> {admin.name}
            </div>
            <div className="profile-text">
              <strong>Email:</strong> {admin.email}
            </div>
          </div>
          <div className="id-date-container">
            <div className="profile-text">
              <strong>Admin ID:</strong> {admin.adminId}
            </div>
            <div className="profile-text">
              <strong>Date Joined:</strong> {admin.createdAt || 'N/A'}
            </div>
          </div>
        </div>
        <div className="privileges-box">
          <strong>Privileges:</strong>
          <p className="privileges-text">
            {admin.privileges || 'Full Access, User Management'} {/* Replace dynamically */}
          </p>
        </div>
        <br />
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
