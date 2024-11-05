// src/App.js
import React, { useState } from 'react';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleDashboardToggle = () => {
    setShowDashboard(!showDashboard);
  };

  return (
    <div className="App">
      <h1>TaskBuster</h1>
      <button onClick={handleDashboardToggle}>
        {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
      </button>
      {showDashboard ? <Dashboard /> : <TaskList />}
    </div>
  );
}

export default App;
