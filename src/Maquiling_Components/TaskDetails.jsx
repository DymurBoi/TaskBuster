import { useParams,useNavigate } from 'react-router-dom';
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
import { Link,useLocation } from 'react-router-dom';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
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
    },
    h5: {
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
          setUpdateData(task);
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

  const updateTaskComplete = () => {
    const taskToUpdate = { ...updateData, status: 'Completed' };
    axios.put(`/api/taskbuster/putTask`, taskToUpdate, {
      params: { taskId: taskToUpdate.taskId },
    })
      .then(response => {
        console.log("Task updated successfully:", response.data);
      })
      .catch(error => console.error("Error updating task:", error));
  };
  const updateTaskPending = () => {
    const taskToUpdate = { ...updateData, status: 'Pending' };
    axios.put(`/api/taskbuster/putTask`, taskToUpdate, {
      params: { taskId: taskToUpdate.taskId },
    })
      .then(response => {
        console.log("Task updated successfully:", response.data);
      })
      .catch(error => console.error("Error updating task:", error));
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
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };
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
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
          </div>
        </nav>

        <Container fixed sx={{padding:0}} >
        <Typography variant="h3" component="div" sx={{mb:2}}>
          Task Details
        </Typography>
        <Paper elevation={6} sx={{p:5, mb:5}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 70}}>
        <Box sx={{ display: 'flex', width:700, flexDirection: 'column', gap: 1.5}}>
        <Typography variant='h4' component="div">
          Task Name:
        </Typography>
        <Typography variant='h5' component="div">
          {currentData.title}
        </Typography>
        <Typography variant='h4' component="div">
          Description: 
        </Typography>
        <Typography variant='h5' component="div">
          {currentData.description}
        </Typography>
        <Typography variant='h4' component="div">
          Status: 
        </Typography>
        <Typography variant='h5' component="div" sx={{ color: currentData.status === 'Pending' ? 'orange' : currentData.status === 'Completed' ? '#1ad62d' : 'text.secondary',}}>
          {currentData.status}
        </Typography>
        <Typography variant='h4' component="div">
          Due Date: 
        </Typography>
        <Typography variant='h5' component="div">
        {new Date(currentData.dueDate).toLocaleDateString()}
        </Typography>
        <Typography variant='h4' component="div">
         Priority:
        </Typography>
        <Typography variant='h5' component="div">
         {currentData.tag.name}
        </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Tooltip title="Update">
          <Link to={`/taskupdate/${currentData.taskId}`} onClick={(event) => event.stopPropagation()}>
            <Button
              startIcon={<EditIcon />}
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
        {currentData.status === "Pending" ? (
        <Tooltip title="Complete">
            <Button
              startIcon={<CheckCircleOutlineIcon />}
              variant="contained"
              size="large"
              onClick={updateTaskComplete}
              sx={{ width: 200, backgroundColor: '#1ad62d', '&:hover': { backgroundColor: '#19c22a' } }}
            >
              Complete Task
            </Button>
        </Tooltip>
        ) : (
        <Tooltip title="Set to Pending">
            <Button
              startIcon={<ReplayIcon />}  // You can use a replay icon to signify the reset to Pending
              variant="contained"
              size="large"
              onClick={updateTaskPending}
              sx={{ width: 200, backgroundColor: '#fcbf49', '&:hover': { backgroundColor: '#f6a900' } }}
            >
              Set to Pending
            </Button>
        </Tooltip>
      )}
        
        </Box>
        </Box>
        </Paper>
        
        <Box sx={{bgcolor:'#dedede', display: 'flex', flexDirection: 'column',mb:8,borderRadius:4}}>
        
        <form onSubmit={handleSubmit}>
            <Box sx={{pl:3,pr:2,display: 'flex', flexDirection: 'row',gap: 2,m:3,mb:1}}>
            <TextField
              label="Comment Text"
              name="commentText"
              variant="outlined"
              value={newComment.commentText}
              onChange={handleChange}
              fullWidth
              multiline  // Enable multiline mode
              rows={3}   // Number of rows to display
              sx={{bgcolor:'white'}}  // Adjust minimum height
            />
              {/* Task ID is displayed but not editable */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                sx={{mt:3,width:100}}
              >
                Add Comment
              </Button>
            </Box>
          </form>
        
        <Typography variant='h3' sx={{mb:3}}>Comments</Typography>
        {filteredComments.length > 0 ? (
          filteredComments.map(comment => (
            <Box key={comment.commentId}>
              <Paper elevation={6} sx={{mb:5, ml:5,mr:5,padding:2}}>
                <Box spacing={5}sx={{display: 'flex', flexDirection: 'row',pb:2,gap:5}}>
                <Typography variant='h5'>Comment #{comment.commentId}</Typography>
                <Typography variant='h5'>{new Date(comment.createdAt).toLocaleDateString()}</Typography>
                </Box>
                <Typography variant='h5' sx={{pl:2}}>{comment.commentText}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1,paddingRight:3,ml:0}}>
                <Tooltip title="Update">
                  <Link to={`/taskupdate/${currentData.taskId}`} onClick={(event) => event.stopPropagation()}>
                    <Button
                      startIcon={<EditIcon />}
                      variant="text"
                      size="small"
                      sx={{ width:150,pl:0}}
                    >
                      Update Task
                    </Button>
                  </Link>
                </Tooltip>
                <Tooltip title="Delete">
                <Button
                  variant="text"
                  size="small"
                  startIcon={<DeleteIcon />}
                  sx={{width:150}}
                  onClick={(event) => {
                    event.stopPropagation();
                    confirmButton(currentData.taskId);
                  }}
                >
                  Delete Task
                </Button>
                </Tooltip>
                </Box>
              </Paper>
            </Box>
          ))
        ) : (
          <p>No comments for this task.</p>
        )}
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
      </ThemeProvider>
    </div>
  );
}

export default TaskUpdate;
