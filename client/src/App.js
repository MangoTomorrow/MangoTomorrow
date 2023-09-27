import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components/login';




function App() {
  return (
    <div className="App">
      
        <Routes>
          <Route path="/" element={<SignIn />} />
        </Routes>
     
    </div>
  );
}

export default App;