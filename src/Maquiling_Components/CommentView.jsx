import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ReadComments() {
  const location = useLocation();
  const { taskId } = location.state || {};  // Retrieve the taskId passed from the previous page
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  useEffect(() => {
    if (taskId) {
      // Fetch all comments
      axios.get(`/api/taskbuster/getComment`)
        .then(response => {
          setComments(response.data);
          // Filter comments to only include those related to the specified taskId
          const taskComments = response.data.filter(comment => comment.task.taskId === taskId);
          setFilteredComments(taskComments);
        })
        .catch(error => console.error("Error fetching comments:", error));
    }
  }, [taskId]);

  return (
    <div>
      <h2>Comments for Task {taskId}</h2>
      <ul>
        {filteredComments.length > 0 ? (
          filteredComments.map(comment => (
            <li key={comment.commentId}>
              <h3>Comment #{comment.commentId}</h3>
              <p><strong>Text:</strong> {comment.commentText}</p>
              <p><strong>Created At:</strong> {new Date(comment.createdAt).toLocaleDateString()}</p>
              <p><strong>Task Title:</strong> {comment.task.title}</p>
              <p><strong>Task Description:</strong> {comment.task.description}</p>
            </li>
          ))
        ) : (
          <p>No comments for this task.</p>
        )}
      </ul>
    </div>
  );
}

export default ReadComments;
