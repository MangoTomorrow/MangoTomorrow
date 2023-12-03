
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole, loading } = useAuth();


    const isRoleDetermining = isAuthenticated && userRole === null;

    if (loading || isRoleDetermining) {
        return <div>Loading...</div>; 
    }

    if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;