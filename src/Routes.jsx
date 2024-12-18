// src/RoutesConfig.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './Mefania components/Register';
import Login from './Mefania components/Login';
import TaskView from './Maquiling_Components/TaskView';
import TaskUpdate from './Maquiling_Components/TaskUpdate';
import CommentView from './Maquiling_Components/CommentView'
import TaskCreate from './Maquiling_Components/TaskCreate';
import UserProfile from './Mefania components/UserProfile';
import ToDoLandingPage from './Mefania components/ToDoLandingPage';
import AddToDo from './Mefania components/AddToDo';
import TaskDetails from './Maquiling_Components/TaskDetails';
import CreateComment from './Maquiling_Components/CreateComment'
import CommentUpdate from './Maquiling_Components/CommentUpdate';
const RoutesConfig = ({ loggedInUserId, handleLogin }) => (
  <Routes>
  <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/todos" element={<ToDoLandingPage userId={loggedInUserId} />} />
    <Route path="/profile" element={<UserProfile loggedInUserId={loggedInUserId} />} />
    <Route path="/todos/new" element={<AddToDo userId={loggedInUserId} />} />

    <Route path="/taskview/:toDoListID" element={<TaskView />} />
    <Route path="/taskupdate/:taskId" element={<TaskUpdate/>}/>
    <Route path="/readComments" element={<CommentView/>}/>
    <Route path="/createTask" element={<TaskCreate/>}/>
    <Route path="/taskdetails/" element={<TaskDetails/>}/>
    <Route path="/commentUpdate/" element={<CommentUpdate/>}/>
    
  </Routes>
);

export default RoutesConfig;
