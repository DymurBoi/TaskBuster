import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/tasks/view");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleAddTask = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/tasks/add", newTask);
            setTasks([...tasks, response.data]);
            setNewTask({ title: "", description: "" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleUpdateTask = async (task) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/tasks/update/${task.id}`, task);
            setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
            setEditTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8080/api/tasks/delete/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    // Inline styling
    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f3f3f3',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const headerStyle = {
        textAlign: 'center',
        color: '#333',
    };

    const inputStyle = {
        padding: '8px',
        marginBottom: '10px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const buttonStyle = {
        padding: '8px 16px',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px',
        transition: 'background-color 0.3s',
    };

    const taskCardStyle = {
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '10px',
        backgroundColor: '#fff',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Task Dashboard</h1>

            <div>
                <h2 style={headerStyle}>Add New Task</h2>
                <input
                    style={inputStyle}
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                />
                <input
                    style={inputStyle}
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                />
                <button
                    style={{ ...buttonStyle, backgroundColor: '#28a745' }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
                    onClick={handleAddTask}
                >
                    Add Task
                </button>
            </div>

            <div>
                <h2 style={headerStyle}>Task List</h2>
                {tasks.map(task => (
                    <div key={task.id} style={taskCardStyle}>
                        {editTask && editTask.id === task.id ? (
                            <>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    name="title"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                />
                                <input
                                    style={inputStyle}
                                    type="text"
                                    name="description"
                                    value={editTask.description}
                                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                />
                                <button
                                    style={buttonStyle}
                                    onClick={() => handleUpdateTask(editTask)}
                                >
                                    Save
                                </button>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                                    onClick={() => setEditTask(null)}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setEditTask(task)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
