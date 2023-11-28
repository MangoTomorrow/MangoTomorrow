
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles, ...rest }) => {
    const { isAuthenticated, userRole } = useAuth();

    return (
        <Route
        {...rest}
        render = {({location}) => 
        isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole)) ? (
            children
        ) : (
            <Navigate to="/" state={{ from: location }} />
        )
        }
        />
    );
};

export default ProtectedRoute;