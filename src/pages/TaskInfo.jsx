import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo1.png";

const TaskInfo = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("Task Title");
  const [dueDate, setDueDate] = useState("2024-11-30");
  const [status, setStatus] = useState("Ongoing");
  const [description, setDescription] = useState(
    "This is a placeholder for description. ".repeat(10)
  );
  const [comments, setComments] = useState([
    "This is a placeholder for comments.",
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    setComments([...comments, newComment]);
    setNewComment("");
    setIsDialogOpen(false);
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


      {/* Task Details */}
      <Box padding={4}>
        {/* Back Button */}
        <Box display="flex" alignItems="center" marginBottom={3}>
          <IconButton onClick={() => navigate("/tasklist/1")}>
            <ArrowBackIcon sx={{ color: "#091057" }} />
          </IconButton>
        </Box>

        {/* Task Title */}
        <TextField
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          variant="standard"
          fullWidth
          sx={{
            fontFamily: "Poppins",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: 2,
            "& .MuiInputBase-root": {
              fontSize: "24px",
              fontWeight: "bold",
              fontFamily: "Poppins",
              color: "#091057",
            },
          }}
        />

        {/* Editable Due Date and Status */}
        <Box display="flex" justifyContent="space-between" marginBottom={3}>
          <Box>
            <Typography
              fontFamily="Poppins"
              fontSize="16px"
              color="#091057"
              fontWeight="bold"
              marginBottom={1}
            >
              Due Date:
            </Typography>
            <TextField
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              sx={{
                fontFamily: "Poppins",
                "& input": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  color: "#EC8305"
                },
              }}
            />
          </Box>
          <Box>
            <Typography
              fontFamily="Poppins"
              fontSize="16px"
              color="#091057"
              fontWeight="bold"
              marginBottom={1}
            >
              Status:
            </Typography>
            <TextField
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{
                fontFamily: "Poppins",
                "& .MuiInputBase-root": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  color: "#EC8305",
                },
              }}
            >
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="h6"
          color="#091057"
          fontFamily="Poppins"
          fontWeight="bold"
          marginBottom={1}
        >
          Description
        </Typography>
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          fullWidth
          rows={6}
          variant="outlined"
          sx={{
            backgroundColor: "#F5F5F5",
            borderRadius: "8px",
            fontFamily: "Poppins",
            color: "#091057",
          }}
        />

        {/* Comments Section */}
        <Typography
          variant="h6"
          color="#091057"
          fontFamily="Poppins"
          fontWeight="bold"
          marginTop={4}
          marginBottom={2}
        >
          Comments
        </Typography>
        <Box>
          {comments.map((comment, index) => (
            <Typography
              key={index}
              fontFamily="Poppins"
              fontSize="14px"
              marginBottom={1}
              color="#091057"
            >
              {comment}
            </Typography>
          ))}
        </Box>

        {/* Add Comment Button */}
        <Button
          variant="contained"
          onClick={() => setIsDialogOpen(true)}
          sx={{
            backgroundColor: "#EC8305",
            color: "white",
            fontFamily: "Poppins",
            marginTop: 2,
          }}
        >
          Add Comment
        </Button>
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

      {/* Comment Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            placeholder="Write your comment here..."
            sx={{ backgroundColor: "#F5F5F5", borderRadius: "8px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddComment}
            variant="contained"
            sx={{
              backgroundColor: "#EC8305",
              color: "white",
              fontFamily: "Poppins",
              textTransform: "none",
            }}
          >
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskInfo;
