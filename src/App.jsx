// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './Routes';

const App = () => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const handleLogin = (id) => {
    setLoggedInUserId(id);
  };

  return (
    <Router>
      <RoutesConfig loggedInUserId={loggedInUserId} handleLogin={handleLogin} />
    </Router>
  );
};

export default App;
