//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      checkUserRole(email, onLoginSuccess, onLoginFailure);
    })
    .catch((error) => {
      onLoginFailure(error); 
    });
};

const checkUserRole = (email, onLoginSuccess, onLoginFailure) => {
  fetch('/setAdminRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email}),
  }).then((response) => response.json()).then((data) => {
    if(data.isInitialAdmin) {
      onLoginSuccess('admin');
    } 
  })
};

export default handleLogin;