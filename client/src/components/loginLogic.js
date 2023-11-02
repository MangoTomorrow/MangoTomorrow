//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userId = user.uid; 

     
      fetch('/checkUserRole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }), 
      })
        .then((response) => response.json())
        .then((data) => {
          const userRole = data.role;
          onLoginSuccess(userRole); 
        })
        .catch((error) => {
          onLoginFailure(error); 
        });
    })
    .catch((error) => {
      onLoginFailure(error);
    });
};

export default handleLogin;