

import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export async function handleSignOut() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('sign out fail: ', error);
    }
}

