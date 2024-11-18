
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false); // For confirmation dialog
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('loggedInUserId');

    if (!token || !userId) {
      alert('Please log in to view your profile.');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/read/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setPassword(response.data.password);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        alert('Failed to fetch user data.');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:8080/api/user/update?id=${user.userId}`,
        { ...user, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditing(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`http://localhost:8080/api/user/delete/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully!');
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedInUserId');
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
    setConfirmDelete(false); // Close the confirmation dialog
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="screen">
      <nav className="navbar">
        <Link to="/todos" className="nav-link">
          <h1 className="navbar-logo">TaskBuster</h1>
        </Link>
        <div className="navbar-links">
          <Link to="/todos" className="nav-link">To Do List</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
        </div>
      </nav>

      <div className="screen">
        <div className="profile-container">
          <h2 className="header">{user.name}'s Profile</h2>
          <div>
            <p className="p">Name: {user.name}</p>
            <p className="p">Email: {user.email}</p>
            <p className="p">Date Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <button onClick={() => setEditing(true)} className="button">Edit</button>
            <button onClick={() => setConfirmDelete(true)} className="logout-button">Delete Account</button>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateUser} color="primary">
            Save
          </Button>
          <Button onClick={() => setEditing(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting User */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUser} color="primary">
            Yes
          </Button>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
