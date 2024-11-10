import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function DeleteTag() {
  const [tags, setTags] = useState([]); // Stores the list of tags
  const [deleteMessage, setDeleteMessage] = useState(''); // Holds a success or error message

  useEffect(() => {
    // Fetch all tags on component mount
    axios.get('/api/taskbuster/getTag')
      .then(response => {
        setTags(response.data);
      })
      .catch(error => console.error("Error fetching tags:", error));
  }, []);

  const deleteTag = (tagId) => {
    axios.delete(`/api/taskbuster/deleteTag/${tagId}`)
      .then(() => {
        // Update the tags list after successful deletion
        setTags(prevTags => prevTags.filter(tag => tag.tagId !== tagId));
        setDeleteMessage(`Tag with ID ${tagId} has been successfully deleted.`);
      })
      .catch(error => {
        console.error("Error deleting tag:", error);
        setDeleteMessage("Error deleting the tag. Please try again.");
      });
  };

  return (
    <div>
      <h1>Tag List</h1>
      
      {/* Display all tags with delete buttons */}
      <ul>
        {tags.map(tag => (
          <li key={tag.tagId}>
            <h2>Tag Details</h2>
            <p><strong>Name:</strong> {tag.name}</p>
            <p><strong>Created At:</strong> {new Date(tag.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(tag.updatedAt).toLocaleString()}</p>
            
            {/* Button to delete the tag */}
            <button onClick={() => deleteTag(tag.tagId)}>Delete Tag</button>
          </li>
        ))}
      </ul>

      {/* Display a success or error message */}
      {deleteMessage && (
        <div>
          <p>{deleteMessage}</p>
        </div>
      )}
    </div>
  );
}

export default DeleteTag;
