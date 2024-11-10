import { useState } from 'react';
import axios from 'axios';
import '../App.css';

function UpdateTag() {
  const [selectedTagId, setSelectedTagId] = useState(''); // Holds ID of the tag to update
  const [updatedTag, setUpdatedTag] = useState(null); // Holds the most recently updated tag data
  
  const updateTag = (tagId, newName) => {
    const updatedData = {
      name: newName,
      updatedAt: new Date().toISOString(),
    };

    axios.put(`/api/taskbuster/putTag?tagId=${tagId}`, updatedData)
      .then(response => {
        setUpdatedTag(response.data);
      })
      .catch(error => console.error("Error updating tag:", error));
  };

  const handleUpdateClick = (newName) => {
    if (selectedTagId) {
      updateTag(selectedTagId, newName);
    } else {
      alert("Please enter a valid Tag ID.");
    }
  };

  return (
    <div>
      <h1>Update Tag Priority</h1>
      
      {/* Input for Tag ID to update */}
      <input
        type="text"
        placeholder="Enter Tag ID"
        value={selectedTagId}
        onChange={(e) => setSelectedTagId(e.target.value)}
        required
      />
      
      {/* Priority Selection Buttons */}
      <div>
        <button onClick={() => handleUpdateClick("Low Priority")}>Low Priority</button>
        <button onClick={() => handleUpdateClick("High Priority")}>High Priority</button>
        <button onClick={() => handleUpdateClick("Urgent")}>Urgent</button>
      </div>

      {/* Display the most recently updated tag */}
      {updatedTag && (
        <div>
          <h2>Recently Updated Tag</h2>
          <p><strong>Name:</strong> {updatedTag.name}</p>
          <p><strong>Updated At:</strong> {new Date(updatedTag.updatedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default UpdateTag;
