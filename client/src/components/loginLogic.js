//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const handleLogin = (email, password, onLoginSuccess, onLoginFailure) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      onLoginSuccess(); 
    })
    .catch((error) => {
      onLoginFailure(error); 
    });
};

export default handleLogin;