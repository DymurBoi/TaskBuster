
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
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import './css.css';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { Tooltip } from '@mui/material';

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
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
       {todos.map((todo) => (
          <Box xs={12} sm={6} md={4} key={todo.toDoListID}  sx={{ display: 'flex', flexDirection: 'row' }}>
              <CardContent>
                <Typography sx={{mb:7}} onClick={() => navigate(`/taskview/${todo.toDoListID}`)}variant="h6">{todo.title}</Typography>
              </CardContent>
                <Tooltip title="Update">
                    <Button sx={{ width: '50px' }} variant="outlined" color="success" onClick={() => handleEditDialogOpen(todo)} >
                    <EditIcon/>
                      </Button>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <Button sx={{ width: '50px' }} variant="outlined" color="error"  onClick={(event) => {
                   handleDeleteDialogOpen(todo)
                  }}>
                    <DeleteIcon />
                  </Button>
                </Tooltip> 
          </Box>
        ))}

    </Box>
  );
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
    <div>
       <nav className="navbar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
       <Button onClick={toggleDrawer(true)} sx={{ width: 'auto', mr: 1 }}><ChecklistIcon sx={{color:'white','& .MuiSvgIcon-root': { fontSize: 100 }}} /></Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
          <Button
          sx={{width:'10%',ml:0,color:'white','& .MuiSvgIcon-root': { fontSize: 40 }}}
          ><h1 className="navbar-logo">TaskBuster</h1>
          </Button>
          </Box>
          <div className="navbar-links">
            <Link to="/todos" className="nav-link">Todos</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
          </div>
        </nav>
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
          <Button onClick={() => setEditing(false)} color="red">Cancel</Button>
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
