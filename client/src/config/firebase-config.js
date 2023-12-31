
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyAl4-lZLo7loVjp6pdQN3VqNgacvH5RvWY",
    authDomain: "cppliftingclub.firebaseapp.com",
    projectId: "cppliftingclub",
    storageBucket: "cppliftingclub.appspot.com",
    messagingSenderId: "136697592069",
    appId: "1:136697592069:web:b2b8795781fbb3cf8a1f6c",
    measurementId: "G-ES5FWT7TBM"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Initialize Firestore
  const db = getFirestore(app);

  export {auth, db};