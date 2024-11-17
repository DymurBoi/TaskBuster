import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './css.css';

const API_BASE_URL = "http://localhost:8080/api/user";

const theme = createTheme({
  typography: {
    h2: {
      color: 'black',
      textAlign: 'center',
    },
    h5: {
      color: '#3f51b5',
    },
    body2: {
      color: '#757575',
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ToDoListLanding = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('loggedInUserId');

  useEffect(() => {
    const fetchToDos = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/todos?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTodos(response.data || []);
      } catch (error) {
        console.error("Failed to fetch to-do list:", error);
      }
    };

    fetchToDos();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteT/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo.toDoListID !== id));
      setConfirmDelete(false);
    } catch (error) {
      console.error("Failed to delete to-do:", error);
      setConfirmDelete(false);
    }
  };

  const confirmDeleteDialog = (todo) => {
    setSelectedTodo(todo);
    setConfirmDelete(true);
  };

  const confirmUpdateDialog = (todo) => {
    setSelectedTodo(todo);
    setEditFormData({ title: todo.title, description: todo.description });
    setConfirmUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/updateT/${selectedTodo.toDoListID}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.toDoListID === selectedTodo.toDoListID ? { ...todo, ...editFormData } : todo
        )
      );
      setConfirmUpdate(false);
    } catch (error) {
      console.error("Failed to update to-do:", error);
      setConfirmUpdate(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login'); 
  };

  return (
    <div className="screen">
      <ThemeProvider theme={theme}>
        <nav className="navbar">
          <h1 className="navbar-logo">TaskBuster</h1>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
          </div>
        </nav>

        <Typography variant="h2" sx={{ marginBottom: '2em' }}>
          Your To-Do List
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {todos.map(todo => (
            <Grid item xs={12} sm={6} md={4} key={todo.toDoListID}>
              <Item>
                <Card sx={{ minWidth: 275, maxWidth: 345, margin: '0 auto' }}>
                  <CardContent>
                    <Typography variant="h5">{todo.title}</Typography>
                    <Typography variant="body2">{todo.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => confirmUpdateDialog(todo)}>Update</Button>
                    <Button size="small" color="error" onClick={() => confirmDeleteDialog(todo)}>Delete</Button>
                  </CardActions>
                </Card>
              </Item>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        {confirmDelete && (
          <Dialog
            open={confirmDelete}
            onClose={() => setConfirmDelete(false)}
          >
            <DialogTitle>Are you sure you want to delete this to-do?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDelete(selectedTodo.toDoListID)} color="primary">
                Yes
              </Button>
              <Button onClick={() => setConfirmDelete(false)} color="primary" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Update Confirmation Dialog */}
        {confirmUpdate && (
          <Dialog
            open={confirmUpdate}
            onClose={() => setConfirmUpdate(false)}
          >
            <DialogTitle>Update To-Do</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, description: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdate} color="primary">
                Save
              </Button>
              <Button onClick={() => setConfirmUpdate(false)} color="primary" autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </ThemeProvider>
    </div>
  );
};

export default ToDoListLanding;
