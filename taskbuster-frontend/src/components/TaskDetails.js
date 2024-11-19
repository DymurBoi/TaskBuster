// src/components/TaskDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

function TaskDetails({ task }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/comment/task/${task.id}`)
      .then(response => setComments(response.data))
      .catch(error => console.error(error));
  }, [task]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="task-details">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Due Date: {task.dueDate}</p>

      <h4>Comments</h4>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.content} - {new Date(comment.createdAt).toLocaleString()}</li>
        ))}
      </ul>

      <CommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
    </div>
  );
}

export default TaskDetails;
