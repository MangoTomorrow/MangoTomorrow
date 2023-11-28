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


//we can use this to check if user has verified their email address, and if not they will not be able to login. Need to link with login.js to control this behavior.
const handleEmailVerification = async (actionCode, userData) => {
    try {
        // Apply the email verification code
        await auth.applyActionCode(actionCode);

        console.log('Email verification successful. User is now added.'); 

        await db.collection("users").doc(userData.uid).set({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        });

    } catch (error) {
        console.error('Error verifying email:', error.message);
    }
};

export { handleEmailVerification };