// src/RoutesConfig.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ToDoLandingPage from './components/ToDoLanding';
import AddToDo from './components/AddToDo';

const RoutesConfig = ({ loggedInUserId, handleLogin }) => (
  <Routes>
    <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/todos" element={<ToDoLandingPage userId={loggedInUserId} />} />
    <Route path="/profile" element={<UserProfile loggedInUserId={loggedInUserId} />} />
    <Route path="/todos/new" element={<AddToDo userId={loggedInUserId} />} />
  </Routes>
);

export default RoutesConfig;
