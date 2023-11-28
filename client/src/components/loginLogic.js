//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
  signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    const user = userCredential.user;

    console.log('this is the auth object: ', auth);

    if (!user.emailVerified) {
      onLoginFailure('Please verify your email.');
      return;
    }

    const userRef = doc(db, "users", user.uid);
    try{
      const docSnap = await getDoc(userRef);
      if(!docSnap.exists() || docSnap.data() === null) {
        const userData = JSON.parse(localStorage.getItem('pendingUserData'));
        if(userData) {
          await setDoc(userRef, userData);
          localStorage.removeItem('pendingUserData');
        }
      }

      getUserRoleAndProceed(email, onLoginSuccess, onLoginFailure);
    } catch (error) {
      onLoginFailure('error checking user data: ', error.message);
    }
    
  })
  .catch((error) => {
    console.error('Authentication failed: ', error);
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