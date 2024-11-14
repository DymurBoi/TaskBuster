// src/components/AddToDo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css.css';

const API_BASE_URL = "http://localhost:8080/api/user";

const AddToDo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve userId and token from localStorage on component mount
    const storedUserId = localStorage.getItem('loggedInUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleAddToDo = async () => {
    const toDoData = { title, description, user: { userId } };
    console.log("Sending to-do data:", toDoData); 

    try {
      await axios.post(`${API_BASE_URL}/createT`, toDoData, authHeaders());
      alert("To-Do item added successfully!");
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error("Failed to add to-do item:", error);
      alert("Failed to add to-do item");
    }
  };

  return (
    <div className="screen">
      <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
      </nav>

      <div>
        <div className="addtodo-container">
          <h2 className="header">Add a New To-Do</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea"
          />
          <button onClick={handleAddToDo} className="button">Add To-Do</button>
        </div>
      </div>
    </div>
  );
};

export default AddToDo;
