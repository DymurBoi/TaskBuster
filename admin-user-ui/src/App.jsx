import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AdminUsers from './pages/AdminUsers';
import EditUser from './pages/EditUser';
import CreateUser from './pages/CreateUser';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);

  // Check login status on initial load
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  

  return (
    <Router>
      <Routes>
        {/* Public Route: Admin Login */}
        <Route
          path="/"
          element={
            <AdminLoginPage setIsLoggedIn={setIsLoggedIn} setAdmin={setAdmin} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminDashboard admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminProfile admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminUsers admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsLoggedIn}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateUser admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsLoggedIn}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <EditUser admin={admin} setAdmin={setAdmin} setIsLoggedIn={setIsLoggedIn}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
