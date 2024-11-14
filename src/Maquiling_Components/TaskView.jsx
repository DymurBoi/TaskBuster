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
    <ThemeProvider theme={theme}>
      <Typography variant="h1" sx={{ color: 'black', textAlign: 'center' }}>
        Task List
      </Typography>
      
      {/* Wrapping the task list in a container that centers content */}
      <div className="row">
        {tasks.map(task => (
          <div key={task.taskId} className="col-md-4">
            <Card className="fixed-card" sx={{ minWidth: 275 }}>
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
          </div>
        ))}
        <Card className="fixed-card" sx={{minWidth: 275, cursor: 'pointer', '&:hover': 
        {boxShadow: 6,},}} onClick={handleCardClick}>
      <CardContent>
        <Typography variant="h5" component="div">
        Create Task
        </Typography>
      </CardContent>
    </Card>
      </div>
    </ThemeProvider>
  );
}

export default TaskView;
