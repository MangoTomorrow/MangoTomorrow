import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/login';
import SignUpForm from './components/signUpForm';
import Album from './components/memberDashboard';
import Dashboard from './components/adminDashboard';
import { AuthProvider } from './components/authContext';





function App() {
  return (
    <div className="App">
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/memberDashboard" element={<Album />} allowedRole={['member', 'admin']} />
          <Route path="/getSubscription" element={<getSubscription />} />
          <Route path="/adminDashboard" element={<Dashboard />} allowedRole={['admin']}/>
          
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;