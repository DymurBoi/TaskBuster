import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import TaskList from "./pages/TaskList";
import TaskInfo from "./pages/TaskInfo";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/tasklist/:id" element={<TaskList />} />
        <Route path="/taskinfo/:taskId" element={<TaskInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
