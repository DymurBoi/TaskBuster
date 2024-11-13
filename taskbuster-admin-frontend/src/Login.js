// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // Import CSS

const Login = ({ setIsLoggedIn, setAdmin }) => { // Add setAdmin prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/taskbuster/admin/adminLogin', null, {
                params: {
                    email,
                    password,
                },
            });

            if (response.status === 200) {
                // Assuming the response contains admin data
                const adminData = response.data; // This should be the admin details
                setAdmin(adminData); // Pass the admin data to the parent
                setIsLoggedIn(true);
                
                // Save admin data to localStorage
                localStorage.setItem('admin', JSON.stringify(adminData));
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>} {/* Error message */}
            </form>
        </div>
    );
};

export default Login;
