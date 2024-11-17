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
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

const theme = createTheme({
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h2: {
      color: 'black',
      textAlign: 'center',  // Center the heading text
    }
  },
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
  const [confirm, setConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetch tasks when component mounts or when toDoListID or token changes
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

  // Set the selected task and open the confirmation dialog
  const confirmButton = (id) => {
    setSelectedTask(id);
    setConfirm(true);
  };

  // Delete the selected task from the server
  const deleteTask = (taskId) => {
    if (!taskId) return;

    axios.delete(`http://localhost:8080/api/taskbuster/deleteTask/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        // Remove the task from the state after successful deletion
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
        setConfirm(false); // Close the confirmation dialog
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        setConfirm(false); // Close the dialog in case of an error
      });
  };

  // Handle task creation navigation

  return (
    <div>
      <ThemeProvider theme={theme}>
        <nav className="navbar">
          <h1 className="navbar-logo">TaskBuster</h1>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>
        </nav>
        <div className='screen'>
          <Typography variant="h2">
            Task List
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {/* Wrapping the task list in a container that centers content */}
            {tasks.map(task => (
              <Grid item xs={12} sm={6} md={4} key={task.taskId}>
                  <Card
                    sx={{
                      minWidth: 275, minHeight: 278, maxWidth: 345, margin: "0 auto", cursor: 'pointer',
                      '&:hover': { boxShadow: 6 }, justifyContent: 'center'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {task.title}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                        Status: {task.status}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {task.tag ? task.tag.name : 'No Tag'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <Link to={`/taskdetails`} state={{ taskId: task.taskId }} onClick={(event) => event.stopPropagation()}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: '#fdcc01', alignContent:'center' }}
                      >
                        View Details
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
              </Grid>
            ))}
            <Grid item xs={12} md={6} lg={4}>
              <Link to='/createTask' state={{ toDoListId: toDoListID}}>
              <Card sx={{
                maxWidth: 345, margin: "0 auto", minWidth: 320, minHeight: 278, cursor: 'pointer', '&:hover': { boxShadow: 6 }
              }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Create Task
                  </Typography>
                </CardContent>
              </Card>
              </Link>
            </Grid>

            {/* Confirmation Dialog for Task Deletion */}
            {confirm && (
              <Dialog
                open={confirm}
                onClose={() => setConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure you want to delete this task?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    This action cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => { deleteTask(selectedTask); setConfirm(false); }} color="primary">
                    Yes
                  </Button>
                  <Button onClick={() => setConfirm(false)} color="primary" autoFocus>
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Grid>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default TaskView;
