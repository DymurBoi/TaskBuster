// src/components/TaskComponent.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskComponent = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: '', dueDate: '' });

    // Fetch tasks on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tasks/view");
                setTasks(response.data); // Set tasks state
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    // Handle adding a new task
    const handleAddTask = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/tasks/add", newTask);
            setTasks([...tasks, response.data]); // Update the tasks list with the new task
            setNewTask({ title: '', description: '', status: '', dueDate: '' }); // Reset form
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div>
            <h1>Tasks</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title}: {task.description}</li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
};

export default TaskComponent;
