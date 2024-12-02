
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {Button,IconButton,TextField} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManImage from "../assets/man.jpg";
import { Tooltip } from '@mui/material';
import Logo from "../assets/Logo1.png";
import AddIcon from "@mui/icons-material/Add";
const API_BASE_URL = "http://localhost:8080/api/user";

const ToDoListLanding = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('loggedInUserId');
  const [id,setId]=useState(userId)
  const [open, setOpen] = React.useState(false);

  
  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("User is not authenticated. Token is missing.");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  useEffect(() => {
    const fetchToDos = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/todos?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data || []);
      } catch (error) {
        console.error("Failed to fetch to-do list:", error);
      }
    };

    fetchToDos();
  }, [token, userId]);

  const handleAddTodo = async () => {
    if (!title || !description) {
        alert("Please fill in both title and description!");
        return;
    }

    const newToDo = {
        title: title,
        description: description,
        user: { userId: userId }, // Assuming the userId is set correctly
    };

    try {
        const response = await axios.post(
            `${API_BASE_URL}/createT`,
            newToDo,
            authHeaders()
        );
        // After the to-do is created, add it to the local todos state
        setTodos([...todos, response.data]);
        setTitle('');
        setDescription('');
        setIsAddingTodo(false);  // Close the dialog
    } catch (error) {
        console.error("Failed to create new to-do:", error);
    }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteT/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.toDoListID !== id));
      setConfirmDelete(false);
    } catch (error) {
      console.error("Failed to delete to-do:", error);
      setConfirmDelete(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...selectedTodo, ...editFormData };
      await axios.put(
        `${API_BASE_URL}/updateT`, 
        updatedData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { id: selectedTodo.toDoListID },
        }
      );
  
      // Update the local todos list
      setTodos(todos.map(todo =>
        todo.toDoListID === selectedTodo.toDoListID ? { ...todo, ...editFormData } : todo
      ));
  
      // Close the edit dialog
      setEditing(false);
      setSelectedTodo(null); // Clear selectedTodo
    } catch (error) {
      console.error("Failed to update to-do:", error);
    }
  };

  const handleEditDialogOpen = (todo) => {
    setSelectedTodo(todo);
    setEditFormData({ title: todo.title, description: todo.description });
    setEditing(true);
  };

  const handleDeleteDialogOpen = (todo) => {
    setSelectedTodo(todo);
    setConfirmDelete(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };

  return (
    <div>
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
      <Box>
        <img
          src={ManImage}
          alt="Man"
          style={{ width: "100%", height: "450px", objectFit: "cover" }}
        />
      </Box>
      <Box sx={{pl:4,pt:4,pr:2}}>
        <Typography
          variant="h4"
          color="#091057"
          fontFamily="Poppins"
          fontWeight="bold"
          marginBottom={1}
        >
          To-Do Lists
        </Typography>
        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingTodo(true)}
            sx={{
              backgroundColor: "#EC8305",
              color: "white",
              fontFamily: "Poppins",
              textTransform: "none",
            }}
          >
            Add List
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ml:4}}>
      {todos.map((todo) => (
        <Box
        key={todo.toDoListID}
        width="300px"
        padding={2}
        bgcolor="#F1F0E8"
        borderRadius="8px"
        boxShadow={2}
        sx={{
          cursor: "pointer",
          "&:hover": {
            boxShadow: 4,
          },
        }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigation if DeleteIcon is clicked
          navigate(`/taskview/${todo.toDoListID}`)
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="h6"
                  fontFamily="Poppins"
                  fontWeight="bold"
                  color="#091057"
                >
                  {todo.title}
                </Typography>
                <Box>
                <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when removing
                    handleDeleteDialogOpen(todo)
                  }}
                  
                  sx={{ color: "#EC8305" }}
                >
                  <DeleteIcon />
                </IconButton>
                </Tooltip>
                <Tooltip title="Update">
            <IconButton 
              size="small"
              color="primary" 
              onClick={(e) => {e.stopPropagation();
              handleEditDialogOpen(todo)}}>
              <EditIcon />
            </IconButton>
          </Tooltip>
                </Box>  
          </Box>
          <Box>
                  <Typography
                    color="#EC8305"
                    fontFamily="Poppins"
                    fontSize="14px"
                  >
                    {todo.description}
                  </Typography>
              </Box>
          </Box>
      ))}
      </Box>
      <Box
        bgcolor="#091057"
        padding={3}
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={4}
      >
        {/* Social Media Icons */}
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




      {/* Update Dialog */}
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Update To-Do</DialogTitle>
        <DialogContent>
        <TextField
            label="Title"
            type="text"
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            variant="outlined"
            placeholder="Title"
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "8px",mt:1 }}
          />
        <TextField
            label="Description"
            type="text"
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Write your comment here..."
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "8px",mt:2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">Save</Button>
          <Button onClick={() => setEditing(false)} color="red">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Are you sure you want to delete this to-do?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(selectedTodo.toDoListID)} color="primary">
            Yes
          </Button>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={isAddingTodo} onClose={() => setIsAddingTodo(false)}>
    <DialogTitle>Add To-Do</DialogTitle>
    <DialogContent>
        <TextField
            id="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            placeholder="Title of the List"
            required
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "8px" }}
        />
        <TextField
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            placeholder="Description"
            required
            multiline
            rows={4}
            fullWidth
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "8px",mt:2 }}
        />
    </DialogContent>
    <DialogActions>
        <Button
            variant="contained"
            onClick={handleAddTodo} // Call handleAddTodo on submit
            sx={{
                backgroundColor: "#EC8305",
                color: "white",
                fontFamily: "Poppins",
                textTransform: "none",
            }}
        >
            Add Todo List
        </Button>
    </DialogActions>
</Dialog>

    </div>
  );
};

export default ToDoListLanding;
