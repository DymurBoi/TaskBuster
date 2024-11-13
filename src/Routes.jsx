// src/RoutesConfig.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './Mefania components/Register';
import Login from './Mefania components/Login';
import TaskView from './Maquiling_Components/TaskView';
import TaskUpdate from './Maquiling_Components/TaskUpdate';
import CommentView from './Maquiling_Components/CommentView'
import TaskCreate from './Maquiling_Components/TaskCreate';
const RoutesConfig = ({ loggedInUserId, handleLogin }) => (
  <Routes>
    <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/taskview" element={<TaskView/>}/>
    <Route path="/taskupdate/:taskId" element={<TaskUpdate/>}/>
    <Route path="/readComments" element={<CommentView/>}/>
    <Route path="/createTask" element={<TaskCreate/>}/>
  </Routes>
);

export default RoutesConfig;
