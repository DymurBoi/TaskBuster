
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import './css.css';

const API_BASE_URL = "http://localhost:8080/api/user";

const ToDoListLanding = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('loggedInUserId');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("User is not authenticated. Token is missing.");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  useEffect(() => {
    const fetchToDos = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/todos?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data || []);
      } catch (error) {
        console.error("Failed to fetch to-do list:", error);
      }
    };

    fetchToDos();
  }, [token, userId]);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteT/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.toDoListID !== id));
      setConfirmDelete(false);
    } catch (error) {
      console.error("Failed to delete to-do:", error);
      setConfirmDelete(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...selectedTodo, ...editFormData };
      await axios.put(
        `${API_BASE_URL}/updateT`, 
        updatedData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { id: selectedTodo.toDoListID },
        }
      );
  
      // Update the local todos list
      setTodos(todos.map(todo =>
        todo.toDoListID === selectedTodo.toDoListID ? { ...todo, ...editFormData } : todo
      ));
  
      // Close the edit dialog
      setEditing(false);
      setSelectedTodo(null); // Clear selectedTodo
    } catch (error) {
      console.error("Failed to update to-do:", error);
    }
  };

  const handleEditDialogOpen = (todo) => {
    setSelectedTodo(todo);
    setEditFormData({ title: todo.title, description: todo.description });
    setEditing(true);
  };

  const handleDeleteDialogOpen = (todo) => {
    setSelectedTodo(todo);
    setConfirmDelete(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };

  return (
    <div className="screen">
      <nav className="navbar">
        <Link to="/todos" className="nav-link">
          <h1 className="navbar-logo">TaskBuster</h1>
        </Link>
        <div className="navbar-links">
          <Link to="/todos" className="nav-link">To Do List</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
        </div>
      </nav>

      <Typography variant="h2" sx={{ marginBottom: '2em', textAlign: 'center' }}>
        Your To-Do List
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {todos.map((todo) => (
          <Grid xs={12} sm={6} md={4} key={todo.toDoListID}>
            <Card sx={{ minWidth: 275, maxWidth: 345, margin: '0 auto' }}>
              <CardContent>
                <Typography onClick={() => navigate(`/taskview/${todo.toDoListID}`)}variant="h5">{todo.title}</Typography>
                <Typography variant="body2">{todo.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEditDialogOpen(todo)}>Update</Button>
                <Button size="small" color="error" onClick={() => handleDeleteDialogOpen(todo)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid xs={12} sm={6} md={4}>
          <Card
            sx={{
              minWidth: 275,
              maxWidth: 345,
              margin: '0 auto',
              cursor: 'pointer',
              '&:hover': { boxShadow: 6 },
            }}
            onClick={() => navigate('/todos/new')}
          >
            <CardContent>
              <Typography variant="h5">Add New To-Do</Typography>
              <Typography variant="h1" align="center">+</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Update Dialog */}
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Update To-Do</DialogTitle>
        <DialogContent>
          <label>
            Title:
            <input
              type="text"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              className="input"
            />
          </label>
          <label>
            Description:
            <textarea
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              className="input"
            />
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">Save</Button>
          <Button onClick={() => setEditing(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Are you sure you want to delete this to-do?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(selectedTodo.toDoListID)} color="primary">
            Yes
          </Button>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ToDoListLanding;
