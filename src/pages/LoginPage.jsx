import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link as MuiLink } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo1.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      console.log("Navigating to dashboard..."); // Debugging log
      navigate("/dashboard"); // Navigate to the dashboard
    } else {
      alert("Please fill in both email and password.");
    }
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
        <img src={Logo} alt="TaskBuster Logo" style={{ maxWidth: "500px", marginBottom: "20px" }} />
        <Typography color="white" fontFamily="Poppins" textAlign="center">
        </Typography>
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
            variant="h5"
            fontFamily="Poppins"
            fontWeight="bold"
            textAlign="center"
            marginBottom={3}
            color="#091057"
          >
            Welcome to{" "}
            <Typography component="span" color="#EC8305" variant="h3" fontWeight="bold">
              <br />
              TaskBuster
            </Typography>
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ bgcolor: "#F5F5F5" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ bgcolor: "#F5F5F5" }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: "#EC8305",
              color: "white",
              marginTop: 3,
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
          >
            Log In
          </Button>
          <Typography textAlign="center" marginTop={2}>
            No account yet?{" "}
            <MuiLink
              onClick={() => navigate("/register")}
              sx={{ color: "#091057", fontWeight: "bold" }}
            >
              Register Here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
