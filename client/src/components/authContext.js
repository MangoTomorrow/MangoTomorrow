
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ( {children} ) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    return (
        <AuthContext.Provider value = {{ isAuthenticated, setIsAuthenticated, setUserRole, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};