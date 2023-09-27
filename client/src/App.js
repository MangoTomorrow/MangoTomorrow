
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';

import login from './components/login';

function App() {








  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" component={login} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
