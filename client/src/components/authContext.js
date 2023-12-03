
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ( {children} ) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
   
  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth State Changed:', user);
            if(user){
                setIsAuthenticated(true);
                

                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if(docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserRole(userData.role);
                } else {
                    console.error('cannot find user');
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        }
    }, [])




    return (
        <AuthContext.Provider value = {{ isAuthenticated, setIsAuthenticated, setUserRole, userRole, loading }}>
            {!loading ? children : <div> loading... </div>}
        </AuthContext.Provider>
    );
};