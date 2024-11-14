import { useState } from 'react';
import axios from 'axios';
import './task.css';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TextField, Button, Container, Grid, Box } from '@mui/material';

const theme = createTheme({
  typography: {
    h1: {
      color: 'black',
      textAlign: 'center',  // Center the heading text
    },
    button: {
      color: 'yellow'
    }
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function TaskCreate() {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: '',
    tag: { tagId: '' },
    toDoList: {toDoListID: '' },
  });
  const postTag = (priority) => {
    const newTag = {
      name: priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    axios.post('/api/taskbuster/postTag', newTag) // Replace with your API endpoint
      .then(response => {
        // Update submittedTag with the response data of the posted tag
        setSubmittedTag(response.data);
      })
      .catch(error => console.error("Error posting tag:", error));
  };
  const [submittedTask, setSubmittedTask] = useState(null);
  const [submittedTag, setSubmittedTag] = useState(null);
  const postTask = (task) => {
    axios.post('/api/taskbuster/postTask', task)
      .then(response => {
        // Update the submittedTask with the response data of the posted task
        setSubmittedTask(response.data);
        // Reset the form after submission
        setNewTask({
          title: '',
          description: '',
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: '',
          tag: { tagId: '' },
          toDoList: {toDoListID: '' },
        });
      })
      .catch(error => console.error("Error posting task:", error));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    postTask(newTask);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tagId") {
      setNewTask(prevTask => ({
        ...prevTask,
        tag: { ...prevTask.tag, tagId: value },
      }));
    } 
    else if (name === "todoListId") {
        setNewTask(prevTask => ({
          ...prevTask,
          toDoList: { ...prevTask.toDoList, toDoListID: value },
        }));
      } 
    else {
      setNewTask(prevTask => ({
        ...prevTask,
        [name]: value,
      }));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h1" gutterBottom>
          Create a Task
        </Typography>
        <div>
        <button onClick={() => postTag("Low Priority")}>Low Priority</button>
        <button onClick={() => postTag("High Priority")}>High Priority</button>
        <button onClick={() => postTag("Urgent")}>Urgent</button>
        </div>
        <br/>
        {/* Form to create a new task */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              variant="outlined"
              value={newTask.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              variant="outlined"
              value={newTask.description}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Due Date"
              name="dueDate"
              type="datetime-local"
              variant="outlined"
              value={newTask.dueDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Tag ID"
              name="tagId"
              variant="outlined"
              type="number"
              value={newTask.tag.tagId}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Todo List ID"
              name="todoListId"
              variant="outlined"
              type="number"
              value={newTask.toDoList.toDoListID}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </Box>
        </form>

        {/* Display the most recently submitted task */}
        {submittedTask && (
          <Box sx={{ mt: 4, backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2 }}>
            <Typography variant="h6">Recently Submitted Task</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><strong>Title:</strong> {submittedTask.title}</Grid>
              <Grid item xs={6}><strong>Description:</strong> {submittedTask.description}</Grid>
              <Grid item xs={6}><strong>Status:</strong> {submittedTask.status}</Grid>
              <Grid item xs={6}><strong>Due Date:</strong> {new Date(submittedTask.dueDate).toLocaleString()}</Grid>
              <Grid item xs={6}><strong>Tag ID:</strong> {submittedTask.tag.tagId}</Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default TaskCreate;
