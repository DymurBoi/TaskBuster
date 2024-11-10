import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Read() {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskComments, setTaskComments] = useState([]);

  useEffect(() => {
    // Fetching tasks
    axios.get('/api/taskbuster/getTask')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error("Error fetching tasks:", error));

    // Fetching comments
    axios.get('/api/taskbuster/getComment')
      .then(response => {
        console.log('Comments:', response.data);  // Check the structure of the comments
        setComments(response.data);
      })
      .catch(error => console.error("Error fetching comment data:", error));
  }, []);

  // Function to handle button click and filter comments for a specific task
  const handleShowComments = (taskId) => {
    setSelectedTaskId(taskId);
    
    // Filter comments based on taskId inside the nested task object
    const relatedComments = comments.filter(comment => comment.task.taskId === taskId); 
    
    setTaskComments(relatedComments);
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.taskId}>
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Tag:</strong> {task.tag ? task.tag.name : 'No Tag'}</p>
            <button onClick={() => handleShowComments(task.taskId)}>Show Comments</button>
          </li>
        ))}
      </ul>

      {selectedTaskId && (
        <div>
          <h2>Comments for Task {selectedTaskId}</h2>
          <ul>
            {taskComments.length > 0 ? (
              taskComments.map(comment => (
                <li key={comment.commentId}>
                  <h2>Comment #{comment.commentId}</h2>
                  <p><strong>Comment Text:</strong> {comment.commentText}</p>
                  <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
                  <p><strong>Task:</strong> {comment.task.title}</p>
                  <p><strong>Task Description:</strong> {comment.task.description}</p>
                </li>
              ))
            ) : (
              <p>No comments for this task.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Read;
