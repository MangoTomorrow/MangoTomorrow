//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;

    if (!user.emailVerified) {
      onLoginFailure('Please verify your email.');
      return;
    }

    db.collection("users").doc(user.uid).get()
      .then((doc) => {
        if (!doc.exists) {

          const userData = JSON.parse(localStorage.getItem('pendingUserData'));
          if (userData) {
            db.collection("users").doc(user.uid).set(userData)
              .then(() => {
                localStorage.removeItem('pendingUserData');
                getUserRoleAndProceed(email, onLoginSuccess, onLoginFailure);
              })
              .catch(error => {
                onLoginFailure('Error adding user data to Firestore: ', error.message);
              });
          } else {
   
            getUserRoleAndProceed(email, onLoginSuccess, onLoginFailure);
          }
        } else {

          getUserRoleAndProceed(email, onLoginSuccess, onLoginFailure);
        }
      })
      .catch(error => {
        onLoginFailure('Error checking user data: ', error.message);
      });
  })
  .catch((error) => {
    onLoginFailure('Authentication failed: ', error.message);
  });
};

const getUserRoleAndProceed = (email, onLoginSuccess, onLoginFailure) => {
  getUserRole(email).then((role) => {
    onLoginSuccess(role);
  }).catch((error) => {
    onLoginFailure('Error checking user role: ', error.message);
  });
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