
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase-config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ( {children} ) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth State Changed:', user);
            if(user){
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
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