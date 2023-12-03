
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole } = useAuth();
        
    if(!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
        
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;