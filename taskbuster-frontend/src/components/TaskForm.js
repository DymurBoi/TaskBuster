import axios from 'axios';
import React, { useState } from 'react';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/tasks/add', {
                title,
                description,
                status,
                dueDate: new Date(),
            });
            console.log('Task added:', response.data);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Inline styles
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f3f3f3',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const titleStyle = {
        marginBottom: '16px',
        fontSize: '24px',
        color: '#333',
        textAlign: 'center',
    };

    const inputStyle = {
        padding: '10px',
        marginBottom: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    };

    const selectStyle = {
        ...inputStyle,
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    return (
        <form style={formStyle} onSubmit={handleSubmit}>
            <h2 style={titleStyle}>Add New Task</h2>
            <input
                style={inputStyle}
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                style={inputStyle}
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <select
                style={selectStyle}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
            </select>
            <button
                style={buttonStyle}
                type="submit"
                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
