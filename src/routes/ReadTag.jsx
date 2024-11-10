import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function ReadTag() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios.get('/api/taskbuster/getTag')
      .then(response => {
        setTags(response.data);
      })
      .catch(error => console.error("Error fetching tags:", error));
  }, []);

  return (
    <div>
      <h1>Tag List</h1>
      <ul>
        {tags.map(tag => (
          <li key={tag.tagId}>
            <h2>Tag Details</h2>
            <p><strong>Name:</strong> {tag.name}</p>
            <p><strong>Created At:</strong> {new Date(tag.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(tag.updatedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReadTag;
