// src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskDetails from './TaskDetails';
import TaskForm from './TaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks/view');
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDelete = async (taskId) => {
    try {
      console.log("Deleting task with ID:", taskId);  // Ensure taskId is the correct value
      const response = await axios.delete(`http://localhost:8080/api/tasks/delete/${taskId}`);
      console.log('Task deleted successfully:', response.data);
      // Update state to remove the deleted task
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <ul>
        {tasks.map(task => (
          <li key={task.id} onClick={() => handleSelectTask(task)}>
            {task.title} - {task.status}
            <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedTask && <TaskDetails task={selectedTask} />}
    </div>
  );
}

export default TaskList;
