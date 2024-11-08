import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css.css';

const AddToDo = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddToDo = async () => {
    const toDoData = { title, description, user: { userId } };
    try {
      const response = await axios.post('http://localhost:8080/api/user/createT', toDoData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.status === 200) {
        alert("To-Do item added successfully!");
        setTitle('');
        setDescription('');
      } else {
        alert("Failed to add to-do item");
      }
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
          <Link to="/add-todo" className="nav-link">Add To-Do</Link>
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
