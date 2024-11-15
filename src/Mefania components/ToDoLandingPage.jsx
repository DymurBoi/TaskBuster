// src/components/ToDoListLanding.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './css.css';

const API_BASE_URL = "http://localhost:8080/api/user";

const ToDoListLanding = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('loggedInUserId'); // Assuming userId is stored in local storage

  useEffect(() => {
    const fetchToDos = async () => {
      if (!token) {
        console.error("Token is missing");
        return;
      }
  
      const userId = localStorage.getItem('loggedInUserId'); // Ensure userId is stored in localStorage after login
      console.log("Retrieved userId:", userId);
  
      try {
        const response = await axios.get(`${API_BASE_URL}/todos?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTodos(response.data || []);
      } catch (error) {
        console.error("Failed to fetch to-do list:", error);
      }
    };
  
    fetchToDos();
  }, [token]);

  const handleViewDetails = (todo) => {
    setSelectedTodo(todo);
    setIsEditing(false);
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setIsEditing(true);
    setEditFormData({ title: todo.title, description: todo.description });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteT/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(todos.filter(todo => todo.toDoListID !== id));
    } catch (error) {
      console.error("Failed to delete to-do:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...selectedTodo, ...editFormData };
      const response = await axios.put(`${API_BASE_URL}/updateT`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { id: selectedTodo.toDoListID }
      });
      setTodos(todos.map(todo =>
        todo.toDoListID === selectedTodo.toDoListID ? { ...todo, ...editFormData } : todo
      ));
      setIsEditing(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Failed to update to-do:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };

  return (
    <div className="screen">
      <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <span onClick={handleLogout} className="nav-link logout-text">Logout</span>
        </div>
      </nav>

      <div className="todo-container">
        <h2 className="header">Your To-Do List</h2>
        <button onClick={() => navigate('/todos/new')} className="button">Add To-Do</button>
        {todos.length > 0 ? (
          todos.map(todo => (
            <div key={todo.toDoListID} className="todo-item" >
              <h3 onClick={() => navigate(`/taskview/${todo.toDoListID}`)}className="todo-title" >{todo.title}</h3>
              <h2  className="todo-title">{todo.description}</h2>
              <button onClick={() => handleEdit(todo)} className="button">Edit</button>
              <button onClick={() => handleDelete(todo.toDoListID)} className="button">Delete</button>
            </div>
          ))
        ) : (
          <p className="text-color-black">No to-do items found.</p>
        )}

        {selectedTodo && !isEditing && (
          <div className="details-view">
            <h3 className="text-color-black">To-Do Details</h3>
            <p className="text-color-black"><strong>Title:</strong> {selectedTodo.title}</p>
            <p className="text-color-black"><strong>Description:</strong> {selectedTodo.description}</p>
            <p className="text-color-black"><strong>Status:</strong> {selectedTodo.status}</p>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleUpdate} className="edit-form">
            <h3 className="text-color-black">Edit To-Do</h3>
            <label className="label">
              Title:
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
                className="input"
              />
            </label>
            <label className="label">
              Description:
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                required
                className="textarea"
              />
            </label>
            <button type="submit" className="button">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="button">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ToDoListLanding;
