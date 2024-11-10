import { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Post() {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: '',
    tag: { tagId: '' },
  });//store data to submit pwede ra ni ilisan sa mga fields nimo

  const [submittedTask, setSubmittedTask] = useState(null);
  
  const postTask = (task) => {
    axios.post('/api/taskbuster/postTask', task)//api link
      .then(response => {
        // Update the submittedTask with the response data of the posted task
        setSubmittedTask(response.data);
        // Reset the form after submission
        setNewTask({
          title: '',
          description: '',
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: '',
          tag: { tagId: '' },
        });
      })//kani para blank ang info inig submit
      .catch(error => console.error("Error posting task:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postTask(newTask);
  };//

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tagId") {
      setNewTask(prevTask => ({
        ...prevTask,
        tag: { ...prevTask.tag, tagId: value },
      }));
    } else {
      setNewTask(prevTask => ({
        ...prevTask,
        [name]: value,
      }));
    }
  };//para ra ni inig input 

  //ang naa sa ubos kay mura ra html nga output
  return (
    <div>
      <h1>Create a New Task</h1>
      
      {/* Form to create a new task */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newTask.title}
          onChange={handleChange}
          required
        />
        <input class="textbox"
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleChange}
          required
        />
        <input 
          type="datetime-local"
          name="dueDate"
          placeholder="Due Date"
          value={newTask.dueDate}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tagId"
          placeholder="Tag ID"
          value={newTask.tag.tagId}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Display the most recently submitted task */}
      {submittedTask && (
        <div>
          <h2>Recently Submitted Task</h2>
          <p><strong>Title:</strong> {submittedTask.title}</p>
          <p><strong>Description:</strong> {submittedTask.description}</p>
          <p><strong>Status:</strong> {submittedTask.status}</p>
          <p><strong>Due Date:</strong> {new Date(submittedTask.dueDate).toLocaleString()}</p>
          <p><strong>Tag ID:</strong> {submittedTask.tag.tagId}</p>
        </div>
      )}
    </div>
  );
}

export default Post;
