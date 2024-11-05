import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (taskToDelete) => {
    // Remove task from the local state immediately
    setTasks(tasks.filter(task => task !== taskToDelete));

    try {
      // Optional: You can choose to comment this out if you don't need the backend deletion
      await axios.delete(`http://localhost:8080/api/tasks/delete/${taskToDelete.id}`);
      console.log("Task deleted from backend");
    } catch (error) {
      console.error("Error deleting task from backend:", error);
      // Optionally, you could revert the state change if the deletion fails
      setTasks(prevTasks => [...prevTasks, taskToDelete]); // Restore task if needed
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
