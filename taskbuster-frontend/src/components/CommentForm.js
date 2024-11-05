// src/components/CommentForm.js
import React, { useState } from 'react';
import axios from 'axios';

function CommentForm({ taskId, onCommentAdded }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/comment/add/${taskId}`, content, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      onCommentAdded(response.data);
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Add Comment</button>
    </form>
  );
}

export default CommentForm;
