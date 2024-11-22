import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TextField, Button, Container, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './task.css'; // Adjust to your CSS file

const theme = createTheme({
  typography: {
    h2: {
      color: 'black',
      textAlign: 'center',  // Center the heading text
    },
    button: {
      color: 'yellow',
    },
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

function CommentUpdate() {
  const location = useLocation();
  const { taskId,commentId } = location.state || {}; // Access the taskId passed via state
  const [id, setId] = useState(taskId);
  const [commentData, setCommentData] = useState({
    commentId:commentId,
    commentText: '', // This holds the content of the comment
    task: { taskId: id }, // Automatically set taskId from state
    createdAt: new Date().toISOString(),
  });
  const [submittedComment, setSubmittedComment] = useState(null);
  const navigate = useNavigate();

  // Update `id` when location.state changes
  useEffect(() => {
    if (location.state && location.state.taskId) {
      setId(location.state.taskId);
    }
  }, [location.state]);

  const postComment = (comment) => {
    axios.post('/api/taskbuster/postComment', comment) // Replace with your API endpoint
      .then(response => {
        // Update the submittedComment with the response data of the posted comment
        setSubmittedComment(response.data);
        // Reset the form after submission
        setCommentData({
          commentText: '',
          task: { taskId: id },
          createdAt: new Date().toISOString(),
        });
      })
      .catch(error => console.error("Error posting comment:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postComment(commentData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
      </nav>
      <div className='screen'>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography variant="h2" gutterBottom>
            Update Comment
          </Typography>

          {/* Paper component for form container */}
          <Paper elevation={3} sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Comment Text"
                  name="commentText"
                  variant="outlined"
                  value={commentData.commentText}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, bgcolor: "#fdcc01" }}
                >
                  Update Comment
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Display the most recently submitted comment */}
          {submittedComment && (
            <Box sx={{ mt: 4, backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2 }}>
              <Typography variant="h6">Recently Submitted Comment</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><strong>Comment Text:</strong> {submittedComment.commentText}</Grid>
                <Grid item xs={12}><strong>Task ID:</strong> {submittedComment.task.taskId}</Grid>
                <Grid item xs={12}><strong>Created At:</strong> {new Date(submittedComment.createdAt).toLocaleString()}</Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default CommentUpdate;
