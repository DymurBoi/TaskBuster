import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [editTask, setEditTask] = useState(null);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/tasks/view");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Handle adding a new task
    const handleAddTask = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/tasks/add", newTask);
            setTasks([...tasks, response.data]);
            setNewTask({ title: "", description: "" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Handle task update
    const handleUpdateTask = async (task) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/tasks/update/${task.id}`, task);
            setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
            setEditTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8080/api/tasks/delete/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Handle form input changes for new task
    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    // Render component
    return (
        <div>
            <h1>Task Dashboard</h1>

            <div>
                <h2>Add New Task</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            <div>
                <h2>Task List</h2>
                {tasks.map(task => (
                    <div key={task.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        {editTask && editTask.id === task.id ? (
                            <>
                                <input
                                    type="text"
                                    name="title"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={editTask.description}
                                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                />
                                <button onClick={() => handleUpdateTask(editTask)}>Save</button>
                                <button onClick={() => setEditTask(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <button onClick={() => setEditTask(task)}>Edit</button>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
