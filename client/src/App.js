import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/login';
import SignUpForm from './components/signUpForm';
import Album from './components/memberDashboard';




function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/memberDashboard" element={<Album />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;