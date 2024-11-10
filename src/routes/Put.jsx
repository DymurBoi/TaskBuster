import { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Put() {
  const [updateData, setUpdateData] = useState({
    taskId: '',
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
    tag: { tagId: '', name: '' }
  });

  const [updatedTask, setUpdatedTask] = useState(null);

  const updateTask = (task) => {
    axios.put(`/api/taskbuster/putTask`, task, {
      params: {
        taskId: task.taskId // Pass taskId as a query parameter
      }
    })
      .then(response => {
        setUpdatedTask(response.data);
        setUpdateData({
          taskId: '',
          title: '',
          description: '',
          status: 'Pending',
          dueDate: '',
          tag: { tagId: '', name: '' }
        });
      })
      .catch(error => console.error("Error updating task:", error));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateTask(updateData);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagSelect = (tagId, tagName) => {
    setUpdateData(prevData => ({
      ...prevData,
      tag: { tagId, name: tagName }
    }));
  };

  return (
    <div>
      <h1>Update Task</h1>

      {/* Form to update an existing task */}
      <form onSubmit={handleUpdateSubmit}>
        <input
          type="text"
          name="taskId"
          placeholder="Task ID"
          value={updateData.taskId}
          onChange={handleUpdateChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={updateData.title}
          onChange={handleUpdateChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={updateData.description}
          onChange={handleUpdateChange}
          required
        />
        <input
          type="datetime-local"
          name="dueDate"
          placeholder="Due Date"
          value={updateData.dueDate}
          onChange={handleUpdateChange}
          required
        />
        {/* Dropdown to select status */}
        <label>Status:</label>
        <select name="status" value={updateData.status} onChange={handleUpdateChange} required>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br/><br/>
        {/* Buttons to select tag priority */}
        <div>
          <label>Priority Tag:</label>
          <br/>
          <button type="button" onClick={() => handleTagSelect(1, 'Low Priority')}>Low Priority</button>
          <button type="button" onClick={() => handleTagSelect(2, 'High Priority')}>High Priority</button>
          <button type="button" onClick={() => handleTagSelect(3, 'Urgent')}>Urgent</button>
        </div>
        <br/>
        <button type="submit">Update Task</button>
      </form>

      {/* Display the updated task details */}
      {updatedTask && (
        <div>
          <h2>Updated Task</h2>
          <p><strong>Title:</strong> {updatedTask.title}</p>
          <p><strong>Description:</strong> {updatedTask.description}</p>
          <p><strong>Status:</strong> {updatedTask.status}</p>
          <p><strong>Due Date:</strong> {new Date(updatedTask.dueDate).toLocaleString()}</p>
          <p><strong>Tag ID:</strong> {updatedTask.tag.tagId}</p>
          <p><strong>Tag Name:</strong> {updatedTask.tag.name}</p>
        </div>
      )}
    </div>
  );
}

export default Put;
