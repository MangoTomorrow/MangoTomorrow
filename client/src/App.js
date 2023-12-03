import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/login';
import SignUpForm from './components/signUpForm';
import Album from './components/memberDashboard';
import Dashboard from './components/adminDashboard';
import { AuthProvider } from './components/authContext';
import ProtectedRoute from './components/protectedRoute';
import EmailVerificationPage from './components/emailVerificationPage';
import { useSessionTimeout } from './hooks/sessionTimer';
import { useAuthNavigation } from './hooks/useAuthNaviation';




function App() {

  useSessionTimeout();
  useAuthNavigation();








  return (
    <div className="App">
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/verify" element={<EmailVerificationPage/>} />
          <Route path="/memberDashboard" element={
            <ProtectedRoute allowedRoles={['member','admin']} >
              <Album />
            </ProtectedRoute>
          } />
          
          
          <Route path="/adminDashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;