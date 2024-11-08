import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import './task.css';
const theme = createTheme({
    typography: {
      body1: {
        color: 'red'
      },
      h1: {
        color: 'black'
      },
      button: {
        color: 'red'
      }
    }
  });
function TaskUpdate() {
  const { taskId } = useParams();  // Get taskId from URL
  const [updateData, setUpdateData] = useState({
    taskId: taskId || '',  // Initialize taskId with the one from URL
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
    tag: { tagId: '', name: '' }
  });

  useEffect(() => {
    if (taskId) {
      // Fetch the task details if needed for pre-filling the form
      axios.get(`/api/taskbuster/getTask/${taskId}`)
        .then(response => setUpdateData(response.data))
        .catch(error => console.error("Error fetching task:", error));
    }
  }, [taskId]);

  const updateTask = (task) => {
    axios.put(`/api/taskbuster/putTask`, task, {
      params: { taskId: task.taskId }
    })
      .then(response => {
        console.log("Task updated successfully:", response.data);
      })
      .catch(error => console.error("Error updating task:", error));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateTask(updateData);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
    <ThemeProvider theme={theme}>
    <Typography variant="h1" component="div">
        Update Task
      </Typography>
      <form onSubmit={handleUpdateSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={updateData.title}
          onChange={handleUpdateChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={updateData.description}
          onChange={handleUpdateChange}
          required
        />
        <input
          type="datetime-local"
          name="dueDate"
          placeholder="Due Date"
          value={updateData.dueDate}
          onChange={handleUpdateChange}
          required
        />
        <button type="submit">Update Task</button>
      </form>
    </ThemeProvider>
    </div>
  );
}

export default TaskUpdate;
