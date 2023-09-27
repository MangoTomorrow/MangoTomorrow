import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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