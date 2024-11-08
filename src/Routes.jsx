// src/RoutesConfig.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ToDoList from './components/ToDoList';
import AddToDo from './components/AddToDo';

const RoutesConfig = ({ loggedInUserId, handleLogin }) => (
  <Routes>
    <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/profile" element={<UserProfile loggedInUserId={loggedInUserId} />} />
    <Route path="/todos" element={<ToDoList userId={loggedInUserId} />} />
    <Route path="/todos/new" element={<AddToDo userId={loggedInUserId} />} />
  </Routes>
);

export default RoutesConfig;
