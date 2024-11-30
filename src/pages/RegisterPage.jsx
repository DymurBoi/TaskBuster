import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link as MuiLink, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../assets/Logo1.png"; // Import the logo image
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Toast notification for successful registration
    toast.success("You registered successfully!");
    // Redirect back to login page after a short delay
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <Box display="flex" minHeight="100vh" width="100%">
      {/* Left Side */}
      <Box
        flex={1}
        bgcolor="#091057"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* Logo */}
        <img src={Logo} alt="TaskBuster Logo" style={{ maxWidth: "500px", marginBottom: "20px" }} />

      </Box>

      {/* Right Side */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#F1F0E8"
        padding={5}
      >
        <Box
          width="100%"
          maxWidth="400px"
          bgcolor="white"
          padding={4}
          borderRadius="8px"
          boxShadow={3}
        >
          <Typography
            variant="h4"
            fontFamily="Poppins"
            fontWeight="bold"
            textAlign="center"
            color="#091057"
            marginBottom={3}
          >
            Register
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            sx={{ bgcolor: "#F5F5F5", borderRadius: "5px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            variant="outlined"
            sx={{ bgcolor: "#F5F5F5", borderRadius: "5px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            sx={{ bgcolor: "#F5F5F5", borderRadius: "5px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body2"
            color="gray"
            fontFamily="Poppins"
            marginTop={1}
            marginBottom={2}
          >
            * Password must be at least 8 characters and include a special character.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#EC8305",
              color: "white",
              fontFamily: "Poppins",
              marginBottom: 3,
            }}
            onClick={handleRegister}
          >
            Submit
          </Button>
          {/* Centered Back to Login Text */}
          <Box textAlign="center">
            <MuiLink
              component="button"
              onClick={() => navigate("/")}
              sx={{
                color: "#091057",
                fontWeight: "bold",
                textDecoration: "none",
                fontFamily: "Poppins",
              }}
            >
              Back to Login
            </MuiLink>
          </Box>
        </Box>
      </Box>
      {/* Toast Notification */}
      <ToastContainer />
    </Box>
  );
};

export default RegisterPage;
