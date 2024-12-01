import * as React from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Box, Container, IconButton, Menu, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Logo from "../assets/Logo1.png"


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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#091057"
        padding={2}
        color="white"
      >
         <Link to="/todos">
         <Button sx={{ width: 'auto', mr: 1 }}><img src={Logo} alt="Logo" style={{ maxWidth: "60px" }} /></Button>
        </Link>
        
        <Box display="flex" gap={3}>
          <Link to="/todos">
            <Typography
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Home
            </Typography>
          </Link>
          <Link to="/profile">
            <Typography
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Profile
            </Typography>
          </Link>
          <Link to="/login">
            <Typography
              sx={{
                color: "white",
                fontFamily: "Poppins",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
              }}
              onClick={handleLogout}
            >
              Logout
            </Typography>
          </Link>
        </Box>
      </Box>

      <Box flex="1" padding={4}>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <IconButton onClick={() => navigate("/todos")}>
            <ArrowBackIcon sx={{ color: "#091057" }} />
          </IconButton>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "24px",
              fontWeight: "bold",
              marginLeft: 2,
              color: "#091057",
            }}
          >
            List
          </Typography>
          <Box display="flex" justifyContent="flex-end" sx={{ml:170}}>
          <Link to="/createTask" state={{ toDoListId: toDoListID }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#EC8305",
                color: "white",
                fontFamily: "Poppins",
                textTransform: "none",
              }}
            >
              Add Task
            </Button>
          </Link>
        </Box>
        </Box>

        
        <Box sx={{mb:2}}>
          <FormControl sx={{ maxWidth: 200, display: 'flex', justifyContent: 'flex-start' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          </Box>
        <Box display="flex" flexWrap="wrap" gap={3} sx={{ textDecoration: 'none' }}>
          {filteredTasks.map((task) => (
            <Link to={`/taskdetails`} state={{ taskId: task.taskId }} 
            onClick={(event) => event.stopPropagation()}
            sx={{ textDecoration: 'none' }}>
              <Box
                key={task.id}
                width="300px"
                padding={2}
                bgcolor="#F1F0E8"
                borderRadius="8px"
                boxShadow={2}
                sx={{ cursor: "pointer" }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="h6"
                    fontFamily="Poppins"
                    fontWeight="bold"
                    color="#091057"
                    sx={{ textDecoration: 'none' }}
                  >
                    {task.title}
                  </Typography>
                </Box>
                <Typography
                  color="#EC8305"
                  fontFamily="Poppins"
                  fontSize="14px"
                  marginTop={1}
                >
                  {task.description}
                </Typography>
                <Typography
                  color="#EC8305"
                  fontFamily="Poppins"
                  fontSize="14px"
                  marginTop={1}
                >
                  {task.status}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        bgcolor="#091057"
        padding={3}
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="auto" // Pushes the footer to the bottom
      >
        <Box display="flex" gap={3} marginBottom={2}>
          <Typography component="button">
            <i className="fab fa-facebook" style={{ color: "white", fontSize: "20px" }}></i>
          </Typography>
          <Typography component="button">
            <i className="fab fa-instagram" style={{ color: "white", fontSize: "20px" }}></i>
          </Typography>
          <Typography component="button">
            <i className="fab fa-twitter" style={{ color: "white", fontSize: "20px" }}></i>
          </Typography>
        </Box>
        <Box display="flex" gap={3} fontFamily="Poppins" fontSize="14px">
          <Typography>Home</Typography>
          <Typography>About</Typography>
          <Typography>Team</Typography>
          <Typography>Services</Typography>
          <Typography>Contact</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default TaskView;
