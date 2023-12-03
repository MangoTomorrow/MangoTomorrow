//sign up logic to use with firebase authentication


import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../config/firebase-config';





const signUp = async (email, password) => {
    try {
        // Create a new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);
        
       


      
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('Email is already in use.');
        } else {
            console.error('Error signing up:', error.message);
        }
    }
};

export default signUp;


