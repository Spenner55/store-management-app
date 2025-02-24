import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles}) => {
    const { role } = useAuth();

    if(!role) return <Navigate to='/unauthorized' replace />;

    if(allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to='/unauthorized' replace />;
    }

    return <Outlet/>;
};

export default RequireAuth;