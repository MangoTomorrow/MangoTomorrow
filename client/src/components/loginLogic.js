//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
  console.log('this is email from loginLogic:', email);
   checkUserRole(email).then((role) => {
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
  console.log('this is email from checkUserRole');
  return fetch('/setAdminRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isInitialAdmin) {
        return 'admin';
      } else {
        return 'member';
      }
    });
};

export default handleLogin;