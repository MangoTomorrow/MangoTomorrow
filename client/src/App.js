import './App.css';
import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SignIn from './components/login';
import SignUpForm from './components/signUpForm';
import Album from './components/memberDashboard';
import Dashboard from './components/adminDashboard';
import { AuthProvider } from './components/authContext';
import ProtectedRoute from './components/protectedRoute';
import EmailVerificationPage from './components/emailVerificationPage';
import { startSessionTime, resetSessionTimer } from './components/sessionTimer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase-config';
import { useSessionTimeout } from './components/sessionTimer';




function App() {

  const navigate = useNavigate();

  useSessionTimeout();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user) {

        startSessionTime();

        const idTokenResult = await user.getIdTokenResult();
        if(idTokenResult.claims.admin) {
          navigate('/adminDashboard');
        } else {
          navigate('memberDashboard');
        }

      } else {
        clearTimeout(sessionTimer);
        navigate('/');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigate, auth]);






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