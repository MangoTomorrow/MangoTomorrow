//sign up logic to use with firebase authentication

import {auth} from '../config/firebase-config';





const signUp = async (email, password) => {
    try{
        await auth.createUserWithEmailAndPassword(email, password);
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