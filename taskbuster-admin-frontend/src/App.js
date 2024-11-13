// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import UserManagement from './UserManagement';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(null);

    // Set login state based on localStorage on load
    useEffect(() => {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        isLoggedIn ? <Navigate to="/usermanagement" /> : <Login setIsLoggedIn={setIsLoggedIn} setAdmin={setAdmin} />
                    } 
                />
                <Route 
                    path="/usermanagement" 
                    element={
                        isLoggedIn 
                        ? <UserManagement admin={admin} setIsLoggedIn={setIsLoggedIn} setAdmin={setAdmin} /> 
                        : <Navigate to="/" />
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
