//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
  console.log('this is email from loginLogic:', email);
   checkUserRole(email).then((role) => {
    console.log('this is email from loginLogic/ in checkUserRole:', email);
    if(role === 'admin') {
      signInWithEmailAndPassword(auth, email, password).then(()=> {
        onLoginSuccess('admin');
      })
    } else if (role === 'member') {
      onLoginSuccess('member');
    } else {
      onLoginFailure('An error occurred while checking the user role');
    }
   })
};

const checkUserRole = (email) => {
  return fetch('/setAdminRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      if (data.role === 'admin') {
        return 'admin';
      } else {
        return 'member';
      }
    })
    .catch((error) => {
      console.error('Error checking user role:', error);
      return 'unknown'; 
    });
};

export default handleLogin;