// MainApp.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoutesConfig from './Routes'; // Import the existing user routes
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AdminUsers from './pages/AdminUsers';
import EditUser from './pages/EditUser';
import CreateUser from './pages/CreateUser';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './styles.css';
const App = () => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);

  // Check login status on initial load
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleUserLogin = (id) => {
    setLoggedInUserId(id);
  };

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route
          path="/*"
          element={<RoutesConfig loggedInUserId={loggedInUserId} handleLogin={handleUserLogin} />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<AdminLoginPage setIsLoggedIn={setIsAdminLoggedIn} setAdmin={setAdmin} />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
              <AdminDashboard admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsAdminLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
              <AdminProfile admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsAdminLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
              <AdminUsers admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsAdminLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
              <CreateUser admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsAdminLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
              <EditUser admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsAdminLoggedIn} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
