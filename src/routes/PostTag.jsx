import { useState } from 'react';
import axios from 'axios';
import '../App.css';

function PostTag() {
  const [submittedTag, setSubmittedTag] = useState(null); // State to store the most recently submitted tag

  // Function to post tag data based on selected priority
  const postTag = (priority) => {
    const newTag = {
      name: priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    axios.post('/api/taskbuster/postTag', newTag) // Replace with your API endpoint
      .then(response => {
        // Update submittedTag with the response data of the posted tag
        setSubmittedTag(response.data);
      })
      .catch(error => console.error("Error posting tag:", error));
  };

  return (
    <div>
      <h1>Select Tag Priority</h1>
      
      {/* Priority Selection Buttons */}
      <div>
        <button onClick={() => postTag("Low Priority")}>Low Priority</button>
        <button onClick={() => postTag("High Priority")}>High Priority</button>
        <button onClick={() => postTag("Urgent")}>Urgent</button>
      </div>

      {/* Display the most recently submitted tag */}
      {submittedTag && (
        <div>
          <h2>Recently Submitted Tag</h2>
          <p><strong>Name:</strong> {submittedTag.name}</p>
          <p><strong>Created At:</strong> {new Date(submittedTag.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(submittedTag.updatedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default PostTag;
