import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Router from './Router.jsx'
import './App.css';

function App() {
  return(
  <>
  <h1>Task and Tag CRUD</h1>
    <Router/>
  </>
  )
}

export default App;
