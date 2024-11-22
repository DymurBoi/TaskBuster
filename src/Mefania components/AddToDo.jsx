// src/components/AddToDo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, FormControl, InputLabel, OutlinedInput, Paper, Button, Container } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import './css.css';

const API_BASE_URL = "http://localhost:8080/api/user";

const AddToDo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
    }finally {
      navigate('/todos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login'); 
  };

  return (
    <div>
      <nav className="navbar">
          <Button
          startIcon={<ChecklistIcon />}
          sx={{width:'10%',ml:4,color:'white','& .MuiSvgIcon-root': { fontSize: 40 }}}
          ><h1 className="navbar-logo">TaskBuster</h1>
          </Button>
          <div className="navbar-links">
            <Link to="/todos" className="nav-link">Todos</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
          </div>
        </nav>
    
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="header">Add a New To-Do</h2>
          
          {/* Title Field */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="title">Title</InputLabel>
            <OutlinedInput
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              required
              fullWidth
            />
          </FormControl>
          
          {/* Description Field */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="description">Description</InputLabel>
            <OutlinedInput
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Description"
              multiline
              rows={4}
              fullWidth
            />
          </FormControl>
          
          {/* Add To-Do Button */}
          <Button 
            onClick={handleAddToDo}
            variant="contained" 
            sx={{ marginTop: 2, padding: '10px 20px', bgcolor: '#fdcc01', color: 'black' }}
          >
            Add To-Do
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default AddToDo;
