import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      body1: {
        color: 'red'
      },
      h1: {
        color: 'black',
      },
      button: {
        color: 'red'
      }
    }
  });
function TaskView() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    axios.get('/api/taskbuster/getTask')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);
  const deleteTask = (taskId) => {
    axios.delete(`/api/taskbuster/deleteTask/${taskId}`)
      .then(() => {
        // Remove the deleted task from the state
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
      })
      .catch(error => console.error("Error deleting task:", error));
  };
  return (
    <ThemeProvider theme={theme}>
    <Typography variant='h1' sx={{ color: 'black'}}>
        Task List
      </Typography>
      <ul>
        {tasks.map(task => (
          <li key={task.taskId}>
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        {task.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{task.status} {task.tag ? task.tag.name : 'No Tag'}</Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{new Date(task.dueDate).toLocaleDateString()}</Typography>
        <Typography variant="body2">
          <br />
          {task.description}
        </Typography>
      </CardContent>
      <CardActions>
      <Link to={`/taskupdate/${task.taskId}`}>Update Task</Link>
      <Button size="small" onClick={() => deleteTask(task.taskId)}>Delete Task</Button>
      </CardActions>
    </Card>
    <br/>
          </li>
        ))}
      </ul>
    </ThemeProvider>
  );
}

export default TaskView;
