import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid2, CircularProgress } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(null);
  const [toDoListCount, setToDoListCount] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, toDoListRes, taskRes] = await Promise.all([
          axios.get("http://localhost:8080/api/user/Usercount"),
          axios.get("http://localhost:8080/api/user/ToDoListCount"),
          axios.get("http://localhost:8080/api/taskbuster/TaskCount"),
        ]);
        setUserCount(userRes.data);
        setToDoListCount(toDoListRes.data);
        setTaskCount(taskRes.data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid2 container spacing={3}>
        {/* User Count Card */}
        <Grid2 item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                User Count
              </Typography>
              <Typography variant="h2" color="primary">
                {userCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* ToDoList Count Card */}
        <Grid2 item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                ToDoList Count
              </Typography>
              <Typography variant="h2" color="secondary">
                {toDoListCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Task Count Card */}
        <Grid2 item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Task Count
              </Typography>
              <Typography variant="h2" color="error">
                {taskCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Dashboard;
