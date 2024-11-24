import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TextField, Button, Container, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import './task.css';

const theme = createTheme({
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h3: {
      color: 'black',
      textAlign: 'center',
      fontWeight:'bold'
    },
    h4: {
      color: 'black',
      textAlign: 'left',
    },
    h5: {
      color: 'black',
      textAlign: 'left',
    },
    body1:{
      color: 'black',
      textAlign: 'left',
    }
  },
});

function TaskUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = location.state || {};  // Get taskId from URL

  const [confirm, setConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
  const [updateData, setUpdateData] = useState({
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
    commentText: '', 
    task: { taskId: taskId }, 
    createdAt: new Date().toISOString(),
  });
  const [filteredComments, setFilteredComments] = useState([]);
  const [submittedComment, setSubmittedComment] = useState(null);

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('loggedInUserId');

  const authHeaders = () => {
    if (!token) {
      navigate('/login');  // Redirect to login if token is missing
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (taskId && token) {
        try {
          const taskResponse = await axios.get(`/api/taskbuster/getTask/${taskId}`, authHeaders());
          setCurrentData(taskResponse.data);
          setUpdateData(taskResponse.data);

          const commentResponse = await axios.get(`/api/taskbuster/getComment`, authHeaders());
          const taskComments = commentResponse.data.filter(comment => comment.task.taskId === taskId);
          setFilteredComments(taskComments);
        } catch (error) {
          console.error('Error fetching task or comments:', error);
        }
      }
    };

    fetchData();
  }, [taskId, token]);

  const postComment = async (comment) => {
    try {
      const response = await axios.post('/api/taskbuster/postComment', comment, authHeaders());
      // Add the new comment to the existing filtered comments
      setFilteredComments(prevComments => [response.data, ...prevComments]);
      setSubmittedComment(response.data);
      setNewComment({
        commentText: '',
        task: { taskId: taskId },
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/taskbuster/deleteComment/${commentId}`, authHeaders());
      // Remove the deleted comment from filteredComments
      setFilteredComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const updateTaskStatus = async (status) => {
    const taskToUpdate = { ...updateData, status: status };
    try {
      await axios.put(`/api/taskbuster/putTask`, taskToUpdate, {
        params: { taskId: taskToUpdate.taskId },
        ...authHeaders()
      });
      setCurrentData(prevState => ({ ...prevState, status }));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
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


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };
  const confirmDeleteTask = () => {
    if (selectedTask) {
      axios.delete(`/api/taskbuster/deleteTask/${selectedTask.taskId}`, authHeaders())
        .then(() => {
          // After deleting, navigate the user to the correct page
          navigate(`/taskview/${currentData.toDoList.toDoListID}`); // Adjust as needed
          setConfirm(false); // Close the confirmation dialog
        })
        .catch(error => {
          console.error('Error deleting task:', error);
          setConfirm(false); // Close the dialog if an error occurs
        });
    }
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <nav className="navbar">
          <Button
            startIcon={<ChecklistIcon />}
            sx={{ width: '10%', ml: 4, color: 'white', '& .MuiSvgIcon-root': { fontSize: 41 } }}
          >
            <h1 className="navbar-logo">TaskBuster</h1>
          </Button>
          <div className="navbar-links">
            <Link to="/todos" className="nav-link">Todos</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
          </div>
        </nav>

        <Container fixed sx={{ padding: 0 }}>
          <Typography variant="h3" component="div" sx={{ mb: 2 ,mt:5}}>
            Task Details
          </Typography>
          <Paper elevation={6} sx={{ p: 5, mb: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 70 }}>
              <Box sx={{ display: 'flex', width: 700, flexDirection: 'column', gap: 1.5 }}>
                <Typography variant='h4' component="div">Task Name:</Typography>
                <Typography variant='h5' component="div">{currentData.title}</Typography>
                <Typography variant='h4' component="div">Description:</Typography>
                <Typography variant='h5' component="div">{currentData.description}</Typography>
                <Typography variant='h4' component="div">Status:</Typography>
                <Typography variant='h5' component="div" sx={{ color: currentData.status === 'Pending' ? 'orange' : currentData.status === 'Completed' ? '#1ad62d' : 'text.secondary' }}>
                  {currentData.status}
                </Typography>
                <Typography variant='h4' component="div">Due Date:</Typography>
                <Typography variant='h5' component="div">{new Date(currentData.dueDate).toLocaleDateString()}</Typography>
                <Typography variant='h4' component="div">Priority:</Typography>
                <Typography variant='h5' component="div">{currentData.tag.name}</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Tooltip title="Update">
                  <Link to={`/taskupdate/${currentData.taskId}`} style={{ textDecoration: 'none' }}>
                    <Button sx={{ width: '150px' }} variant="outlined" color="success" startIcon={<CheckCircleOutlineIcon />} fullWidth>Update Task</Button>
                  </Link>
                </Tooltip>

                <Tooltip title="Delete Task">
                  <Button sx={{ width: '150px' }} variant="outlined" color="error" startIcon={<DeleteIcon />} fullWidth onClick={(event) => {
                    event.stopPropagation();
                    setSelectedTask(currentData); // Set selectedTask before confirming delete
                    setConfirm(true); // Show the delete confirmation dialog
                  }}>
                    Delete Task
                  </Button>
                </Tooltip>

                {/* Task Status Buttons */}
                {currentData.status === 'Pending' ? (
                  <Button
                    sx={{ width: '150px' }}
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    fullWidth
                    onClick={() => updateTaskStatus('Completed')}
                  >
                    Mark as Completed
                  </Button>
                ) : (
                  <Button
                    sx={{ width: '150px' }}
                    variant="outlined"
                    color="warning"
                    startIcon={<ReplayIcon />}
                    fullWidth
                    onClick={() => updateTaskStatus('Pending')}
                  >
                    Mark as Pending
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Comments Section */}
          <Typography variant="h5">Comments</Typography>
          <Box sx={{ width: '100%', marginBottom: '20px' }}>
            {filteredComments.map((comment) => (
              <Box key={comment.commentId} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px',mt:4,ml:5}}>
                <Typography variant="body1">{comment.commentText}</Typography>
                <Button color="error" onClick={() => deleteComment(comment.commentId)} sx={{width:20}}>
                  <DeleteIcon />
                </Button>
              </Box>
            ))}
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Add a Comment"
              name="commentText"
              value={newComment.commentText}
              onChange={handleChange}
              variant="outlined"
              sx={{ marginBottom: '20px' }}
            />
            <Button variant="contained" color="primary" type="submit" sx={{ width: '100%' }}>
              Add Comment
            </Button>
          </form>

          {/* Delete Confirmation Dialog */}
          <Dialog open={confirm} onClose={() => setConfirm(false)}>
            <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
            <DialogContent>
              <DialogContentText>This action cannot be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={confirmDeleteTask} color="primary">Yes</Button>
              <Button onClick={() => setConfirm(false)} color="secondary">No</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default TaskUpdate;
