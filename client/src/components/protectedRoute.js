
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole } = useAuth();
        console.log('user role above protected route: ', userRole);
    if(!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
        console.log('user role at protected route', userRole);
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;