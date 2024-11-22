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
import AddIcon from '@mui/icons-material/Add';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { Container, IconButton, Menu, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

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
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); // Filter status state
  const [confirm, setConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetch tasks when component mounts or when toDoListID or token changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        console.error('Token is missing');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/taskbuster/getTasks?toDoListID=${toDoListID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [token, toDoListID]);

  // Filter tasks based on the selected status
  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === filterStatus));
    }
  }, [tasks, filterStatus]);

  // Set the selected task and open the confirmation dialog
  const confirmButton = (id) => {
    setSelectedTask(id);
    setConfirm(true);
  };

  // Delete the selected task from the server
  const deleteTask = (taskId) => {
    if (!taskId) return;

    axios
      .delete(`http://localhost:8080/api/taskbuster/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Remove the task from the state after successful deletion
        setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
        setConfirm(false); // Close the confirmation dialog
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        setConfirm(false); // Close the dialog in case of an error
      });
  };
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  }
  return (
    <div>
      <ThemeProvider theme={theme}>
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
        <Container fixed sx={{ mb: 15 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Task List
          </Typography>

          {/* Filter Dropdown */}
          <FormControl sx={{ minWidth: 200, mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2} justifyContent="left">
            {filteredTasks.map((task) => (
              <Grid xs={10} sm={6} md={4} key={task.taskId}>
                <Card
                  sx={{
                    minWidth: 275,
                    minHeight: 278,
                    maxWidth: 345,
                    margin: '0 auto',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 },
                    justifyContent: 'center',
                  }}
                >
                  <CardContent sx={{ mb: 5 }}>
                    <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                      {task.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                      Status: {task.status}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {task.tag ? task.tag.name : 'No Tag'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Link to={`/taskdetails`} state={{ taskId: task.taskId }} onClick={(event) => event.stopPropagation()}>
                      <Button variant="contained" size="small" sx={{ backgroundColor: '#fdcc01', alignContent: 'center', mr: 15 }}>
                        View Details
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid xs={12} md={6} lg={4}>
              <Link to="/createTask" state={{ toDoListId: toDoListID }}>
                <Card
                  sx={{
                    maxWidth: 340,
                    margin: '0 auto',
                    minWidth: 275,
                    minHeight: 278,
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ '& .MuiSvgIcon-root': { fontSize: 60 } }}>
                    <Typography variant="h5" component="div" sx={{ mb: 8 }}>
                      Create Task
                    </Typography>
                    <IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                      <AddIcon fontSize="large" />
                    </IconButton>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default TaskView;
