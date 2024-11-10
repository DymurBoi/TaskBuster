import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Delete() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks on component mount
    axios.get('/api/taskbuster/getTask')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Delete task function
  const deleteTask = (taskId) => {
    axios.delete(`/api/taskbuster/deleteTask/${taskId}`)
      .then(() => {
        // Remove the deleted task from the state
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
      })
      .catch(error => console.error("Error deleting task:", error));
  };

  return (
    <div>
      <h1>Task List</h1>
      
      {/* Display list of tasks with delete button */}
      {tasks.map(task => (
        <div key={task.taskId}>
          <h3>{task.title}</h3>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}</p>
          <p><strong>Tag:</strong> {task.tag.name}</p>
          <button onClick={() => deleteTask(task.taskId)}>Delete Task</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Delete;
