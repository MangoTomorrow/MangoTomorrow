//login logic uses firebase to authenticate users and log them in. 

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';




const fetchUserName = async (userId) => {
  const userRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()) {
      const userData = docSnap.data();
      return `${userData.firstName} ${userData.lastName}`;
    
      

    } else {
      console.log('user not found');
      return null;
    }
  } catch (error) {
    console.error('error fetching username', error);
    return null;
  }
};

export { fetchUserName };



//check if user verified email or not
const handleLogin = (email, password, onLoginSuccess, onLoginFailure, setIsAuthenticated, setUserRole ) => {

  

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
      
      
      const role = await getUserRoleAndProceed(email, onLoginSuccess, onLoginFailure, setUserRole);
      

      
      if(role) {
        
        setIsAuthenticated(true);
        await setDoc(userRef, { ...docSnap.data(), role,
          disableReason: docSnap.exists() && docSnap.data().disabledReason !== undefined ? docSnap.data().disabledReason : null,
          disabled: docSnap.exists() && docSnap.data().disabled !== undefined ? docSnap.data().disabled : false
        
        }, { merge: true});
        
      }
    } catch (error) {
      onLoginFailure('error checking user data: ', error.message);
    }
    
  })
  .catch((error) => {
    console.error('Authentication failed: ', error);
    onLoginFailure('Authentication failed: ', error.message);
  });
};


const getUserRoleAndProceed = async (email, onLoginSuccess, onLoginFailure, setUserRole) => {
  try {
    const role = await getUserRole(email);
    setUserRole(role);
    const userName = await fetchUserName(auth.currentUser.uid);
    onLoginSuccess(role, userName);
    return role;
  } catch (error) {
    onLoginFailure('error checking user role: ', error.message);
    return null;
  }
};

//get user role api
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