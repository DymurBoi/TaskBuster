// src/components/ToDoLandingPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css.css';

const ToDoLandingPage = ({ userId }) => {
  const [todoLists, setTodoLists] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/allT`);
        setTodoLists(response.data || []);
      } catch (error) {
        console.error("Failed to fetch to-do lists:", error);
      }
    };
    if (userId) fetchToDos();
  }, [userId]);

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setIsEditing(true);
    setEditFormData({ title: todo.title, description: todo.description });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todo/${id}`);
      setTodoLists(todoLists.filter(todo => todo.toDoListID !== id));
    } catch (error) {
      console.error("Failed to delete to-do:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = { ...selectedTodo, ...editFormData };
    try {
      await axios.put(`http://localhost:8080/api/todo/${selectedTodo.toDoListID}`, updatedData);
      setTodoLists(todoLists.map(todo =>
        todo.toDoListID === selectedTodo.toDoListID ? { ...todo, ...editFormData } : todo
      ));
      setIsEditing(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Failed to update to-do:", error);
    }
  };

  return (
    <div className="screen">
      <nav className="navbar">
        <h1 className="navbar-logo">TaskBuster</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/add-todo" className="nav-link">Add To-Do</Link>
        </div>
      </nav>

      <div className="todo-container">
        <h2 className="header">Your To-Do Lists</h2>
        <div className="todo-lists">
          {todoLists.length > 0 ? (
            todoLists.map((list, index) => (
              <div key={list.toDoListID} className="todo-list-card">
                <h3 className="list-title">To-Do List {index + 1}</h3>
                {list.todos && list.todos.map(todo => (
                  <div key={todo.toDoListID} className="todo-card">
                    <div className="todo-header">
                      <h3>{todo.title}</h3>
                      <div className="menu-icon">
                        <span onClick={() => handleEdit(todo)}>Edit</span>
                        <span onClick={() => handleDelete(todo.toDoListID)}>Delete</span>
                      </div>
                    </div>
                    <p>{todo.description}</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No to-do items found.</p>
          )}

          {/* Add New To-Do List Card */}
          <div className="todo-list-card add-list-card" onClick={() => navigate('/todos/new')}>
            <h3>+ Add New To-Do List</h3>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleUpdate} className="edit-form">
            <h3>Edit To-Do</h3>
            <label>
              Title:
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
                className="input"
              />
            </label>
            <label>
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

export default ToDoLandingPage;
