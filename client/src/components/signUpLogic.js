//sign up logic to use with firebase authentication


import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';


console.log('auth object:', auth);

const signUp = async (email, password) => {


    console.log('auth object inside signUp:', auth);

    
    try{
        
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created');
    } catch (error) {

        if(error.code === 'auth/email-already-in-use') {
            console.log('email is already in use');
        } else {
            console.error('error signing up:' , error.message);
        }

    }
};

export default signUp;