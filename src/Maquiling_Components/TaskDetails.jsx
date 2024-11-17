import { useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TextField, Button, Container, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import { Link,useLocation } from 'react-router-dom';
import './task.css';

const theme = createTheme({
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h3: {
      color: 'black',
      textAlign: 'center',  // Center the heading text
    },
    h4: {
      color: 'black',
      textAlign: 'left',  // Center the heading text
    }
  },
});

function TaskUpdate() {
  const navigate=useNavigate();
  const location = useLocation();
  const { taskId } = location.state || {};  // Get taskId from URL
  const [confirm, setConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredComments, setFilteredComments] = useState([]);
  const [currentData, setCurrentData] = useState({
    taskId: '',
    title: '',
    description: '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: '',
    tag: { tagId: '', name: '' },
    toDoList: { toDoListID: '' },
  });
  const [newComment, setNewComment] = useState({
    commentText: '', // This holds the content of the comment
    task: { taskId: taskId }, // Automatically set taskId from state
    createdAt: new Date().toISOString(),
  });
  const [submittedComment, setSubmittedComment] = useState(null);
  
  useEffect(() => {
    if (taskId) {
      // Fetch task details from API
      axios.get(`/api/taskbuster/getTask/${taskId}`)
        .then(response => {
          const task = response.data;
          setCurrentData(task);
        })
        .catch(error => console.error("Error fetching task:", error));
      
        axios.get(`/api/taskbuster/getComment`)
        .then(response => {
          // Filter comments to only include those related to the specified taskId
          const taskComments = response.data.filter(comment => comment.task.taskId === taskId);
          setFilteredComments(taskComments);
        })
        .catch(error => console.error("Error fetching comments:", error));
    }
  }, [taskId]);
const postComment = (comment) => {
    axios.post('/api/taskbuster/postComment', comment) // Replace with your API endpoint
      .then(response => {
        // Update the submittedComment with the response data of the posted comment
        setSubmittedComment(response.data);
        // Reset the form after submission
        setNewComment({
          commentText: '',
          task: { taskId: taskId },
          createdAt: new Date().toISOString(),
        });
      })
      .catch(error => console.error("Error posting comment:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postComment(newComment);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prevComment => ({
      ...prevComment,
      [name]: value,
    }));
  };
  const confirmButton = (id) => {
    setSelectedTask(id);
    setConfirm(true);
  };
  const deleteTask = (taskId) => {
    if (!taskId) return;

    axios.delete(`http://localhost:8080/api/taskbuster/deleteTask/${taskId}`, {
    })
      .then(() => {
        // Remove the task from the state after successful deletion
        navigate(`/taskview/${currentData.toDoList.toDoListID}`);
        setConfirm(false); // Close the confirmation dialog
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        setConfirm(false); // Close the dialog in case of an error
      });
  };
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
        <Container fixed sx={{padding:0}} >
        <Typography variant="h3" component="div">
          Task Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 70, mb:5 }}>
        <Box sx={{ display: 'flex', width:700, flexDirection: 'column', gap: 2, paddingLeft: 3}}>
        <Typography variant='h4' component="div">
          Task Name: {currentData.title}
        </Typography>
        <Typography variant='h4' component="div">
          Description: {currentData.description}
        </Typography>
        <Typography variant='h4' component="div">
          Status: {currentData.status}
        </Typography>
        <Typography variant='h4' component="div">
          Due Date: {currentData.dueDate}
        </Typography>
        <Typography variant='h4' component="div">
         {currentData.tag.name}
        </Typography>
        </Box>
        <Box sx={{ backgroundColor:"white", display: 'flex', flexDirection: 'column', gap: 5,paddingRight:3 }}>
        <Tooltip title="Update">
          <Link to={`/taskupdate/${currentData.taskId}`} onClick={(event) => event.stopPropagation()}>
            <Button
              variant="contained"
              size="large"
              sx={{ width:200,backgroundColor: '#fdcc01' }}
            >
              Update Task
            </Button>
          </Link>
        </Tooltip>
        <Tooltip title="Delete">
        <Button
          variant="contained"
          size="large"
          startIcon={<DeleteIcon />}
          sx={{width:200, backgroundColor: 'red', size:'small' }}
          onClick={(event) => {
            event.stopPropagation();
            confirmButton(currentData.taskId);
          }}
        >
          Delete Task
        </Button>
        </Tooltip>
        </Box>
        </Box>
        <form onSubmit={handleSubmit}>
            <Box sx={{display: 'flex', flexDirection: 'row',gap: 1,mb:5 }}>
              <TextField
                label="Comment Text"
                name="commentText"
                variant="outlined"
                value={newComment.commentText}
                onChange={handleChange}
                fullWidth
              />
              {/* Task ID is displayed but not editable */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Add Comment
              </Button>
            </Box>
          </form>
        <Box sx={{bgcolor:'green', display: 'flex', flexDirection: 'column'}}>
        <Typography variant='h3'>Comments</Typography>
      <ul>
        {filteredComments.length > 0 ? (
          filteredComments.map(comment => (
            <li key={comment.commentId}>
              <p><strong>Text:</strong> {comment.commentText}</p>
              <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
            </li>
          ))
        ) : (
          <p>No comments for this task.</p>
        )}
      </ul>
      </Box>
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
        </Container>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default TaskUpdate;
