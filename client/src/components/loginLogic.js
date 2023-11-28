//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
 
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

    const user = userCredential.user;

    if(!user.emailVerified) {
      onLoginFailure('Verify email');
      return;
    }
    

    getUserRole(email).then((role) => {
      onLoginSuccess(role);
    }).catch((error) => {
      onLoginFailure('Error checking user role: ', error.message);
    });
  })
  .catch((error) => {
    onLoginFailure('Authentication failed: ', error.message);
  })
  
};

const getUserRole = (email) => {
  return fetch('/getUserRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  .then((response) => response.json())
  .then((data) => data.role )
  .catch((error) => {
    console.error('Error fetching user role: ', error);
    throw error;
  });
};





export default handleLogin;