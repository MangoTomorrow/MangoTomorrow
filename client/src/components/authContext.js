
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase-config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ( {children} ) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user);
            
        })

        return () => {
            unsubscribe();
        }
    })




    return (
        <AuthContext.Provider value = {{ isAuthenticated, setIsAuthenticated, setUserRole, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};