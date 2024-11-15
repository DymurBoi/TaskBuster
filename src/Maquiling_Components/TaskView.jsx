import * as React from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './task.css';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const theme = createTheme({
  typography: {
    h1: {
      color: 'black',
      textAlign: 'center',  // Center the heading text
    },
    button: {
      color: 'yellow'
    }
  }
});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
function TaskView() {
  const { toDoListID } = useParams();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/taskbuster/getTasks?toDoListID=${toDoListID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token, toDoListID]);
  
  const deleteTask = (taskId) => {
    axios.delete(`/api/taskbuster/deleteTask/${taskId}`)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
      })
      .catch(error => console.error("Error deleting task:", error));
  };

    const handleCardClick = () => {
      navigate('/createTask')
    };
  return (
    <div>
    <ThemeProvider theme={theme}>
    <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </div>
        </nav>
      <div className='screen'>
      <Typography variant="h2" sx={{ color: 'black', textAlign: 'center' }}>
        Task List
      </Typography>
      <Grid container spacing={3} justifyContent="center">
      {/* Wrapping the task list in a container that centers content */}
      <div className="row">
        {tasks.map(task => (
            <Grid item xs={12} sm={6} md={4}>
              <Item>
            <Card sx={{ minWidth: 275, maxWidth: 345, margin: "0 auto" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {task.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  {task.status} {task.tag ? task.tag.name : 'No Tag'}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <br />
                  {task.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/taskupdate/${task.taskId}`}>Update Task</Link>
                <Link to="/readComments" state={{ taskId: task.taskId }}>View Comments</Link>
                <Button size="small" onClick={() => deleteTask(task.taskId)}>Delete Task</Button>
              </CardActions>
            </Card>
            </Item>
            </Grid>
        ))}
        <Grid item xs={12} md={6} lg={4}>
        <Item>
        <Card sx={{maxWidth: 345, margin: "0 auto", minWidth: 320,minHeight: 242, cursor: 'pointer', '&:hover': 
        {boxShadow: 6,},}} onClick={handleCardClick}>
      <CardContent>
        <Typography variant="h5" component="div">
        Create Task
        </Typography>
      </CardContent>
    </Card>
    </Item>
    </Grid>
      </div>
      </Grid>
      </div>
    </ThemeProvider>
    </div>
  );
}

export default TaskView;
