import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo1.png";
import ManImage from "../assets/man.jpg";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [todoLists, setTodoLists] = useState([
    { id: 1, name: "List 1", tasks: ["Task 1", "Task 2", "Task 3", "Task 4"] },
    { id: 2, name: "List 2", tasks: ["Task 1", "Task 2", "Task 3", "Task 4"] },
  ]);

  // Function to add a new list
  const addNewList = () => {
    const newId = todoLists.length + 1;
    const newList = { id: newId, name: `List ${newId}`, tasks: [] };
    setTodoLists([...todoLists, newList]);
  };

  // Function to remove a list
  const removeList = (id) => {
    const updatedLists = todoLists.filter((list) => list.id !== id);
    setTodoLists(updatedLists);
  };

  return (
    <Box>
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

      {/* Main Image */}
      <Box>
        <img
          src={ManImage}
          alt="Man"
          style={{ width: "100%", height: "450px", objectFit: "cover" }}
        />
      </Box>

      {/* To-Do Section */}
      <Box padding={4}>
        <Typography
          variant="h4"
          color="#091057"
          fontFamily="Poppins"
          fontWeight="bold"
          marginBottom={1}
        >
          To-Do Lists
        </Typography>

        {/* Add New List Button */}
        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewList}
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

        {/* To-Do Lists */}
        <Box display="flex" flexWrap="wrap" gap={3}>
          {todoLists.map((list) => (
            <Box
              key={list.id}
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
                navigate(`/tasklist/${list.id}`);
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="h6"
                  fontFamily="Poppins"
                  fontWeight="bold"
                  color="#091057"
                >
                  {list.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when removing
                    removeList(list.id);
                  }}
                  sx={{ color: "#EC8305" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box marginTop={2}>
                {list.tasks.map((task, index) => (
                  <Typography
                    key={index}
                    color="#EC8305"
                    fontFamily="Poppins"
                    fontSize="14px"
                  >
                    {task}
                  </Typography>
                ))}
              </Box>
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
    </Box>
  );
};

export default UserDashboard;
