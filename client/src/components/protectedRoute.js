
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole, loading } = useAuth();
    console.log('ProtectedRoute:', { isAuthenticated, userRole, loading });    
    if(loading) {
        return <div>loading ....</div>;
    }


    if(!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
        
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;