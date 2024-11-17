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
  const [isEditing, setIsEditing] = useState(false);
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
    } catch (error) {
      console.error("Failed to delete to-do:", error);
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
                    <Typography variant="h5" component="div">
                      {todo.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      {todo.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/taskview/${todo.toDoListID}`)}>View</Button>
                    <Button size="small" onClick={() => setSelectedTodo(todo)}>Edit</Button>
                    <Button size="small" onClick={() => handleDelete(todo.toDoListID)}>Delete</Button>
                  </CardActions>
                </Card>
              </Item>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4}>
            <Item>
              <Card
                sx={{
                  minWidth: 275,
                  maxWidth: 345,
                  margin: '0 auto',
                  minHeight: 200,
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 6 },
                }}
                onClick={() => navigate('/todos/new')}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    Add New To-Do
                  </Typography>
                </CardContent>
              </Card>
            </Item>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default ToDoListLanding;
