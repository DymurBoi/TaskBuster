import React, { useState } from "react";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/Logo1.png"; // Replace with your logo path
import ManImage from "../assets/man.jpg"; // Replace with your image path

const TaskList = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get list ID from URL params
  const [listName, setListName] = useState(`List ${id}`);
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", description: "This is a placeholder for description." },
    { id: 2, name: "Task 2", description: "This is a placeholder for description." },
  ]);

  // Add a new task
  const addNewTask = () => {
    const newTaskId = tasks.length + 1;
    const newTask = {
      id: newTaskId,
      name: `Task ${newTaskId}`,
      description: "This is a placeholder for description.",
    };
    setTasks([...tasks, newTask]);
  };

  // Remove a task
  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Handle list name change
  const handleListNameChange = (e) => {
    setListName(e.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the layout takes up the full height of the viewport
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#091057"
        padding={2}
        color="white"
      >
        <img src={Logo} alt="Logo" style={{ maxWidth: "60px" }} />
        <Box display="flex" gap={3}>
          <Typography
            sx={{
              color: "white",
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/dashboard")}
          >
            Home
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/profile")}
          >
            Profile
          </Typography>
          <Typography
            sx={{
              color: "#EC8305",
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/")}
          >
            Log out
          </Typography>
        </Box>
      </Box>

      {/* Content Section */}
      <Box flex="1" padding={4}>
        {/* Back Button */}
        <Box display="flex" alignItems="center" marginBottom={2}>
          <IconButton onClick={() => navigate("/dashboard")}>
            <ArrowBackIcon sx={{ color: "#091057" }} />
          </IconButton>
          <TextField
            value={listName}
            onChange={handleListNameChange}
            variant="standard"
            sx={{
              fontFamily: "Poppins",
              fontSize: "24px",
              fontWeight: "bold",
              marginLeft: 2,
              color: "#091057",
            }}
            inputProps={{
              style: { fontSize: "24px", fontWeight: "bold", fontFamily: "Poppins", color: "#091057" },
            }}
          />
        </Box>

        {/* Add New Task Button */}
        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewTask}
            sx={{
              backgroundColor: "#EC8305",
              color: "white",
              fontFamily: "Poppins",
              textTransform: "none",
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* Tasks */}
        <Box display="flex" flexWrap="wrap" gap={3}>
          {tasks.map((task) => (
            <Box
              key={task.id}
              width="300px"
              padding={2}
              bgcolor="#F1F0E8"
              borderRadius="8px"
              boxShadow={2}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/taskinfo/${task.id}`)} // Navigate to TaskInfo page
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="h6"
                  fontFamily="Poppins"
                  fontWeight="bold"
                  color="#091057"
                >
                  {task.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation on delete click
                    removeTask(task.id);
                  }}
                  sx={{ color: "#EC8305" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Typography
                color="#EC8305"
                fontFamily="Poppins"
                fontSize="14px"
                marginTop={1}
              >
                {task.description}
              </Typography>
            </Box>
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
    </Box>
  );
};

export default TaskList;
