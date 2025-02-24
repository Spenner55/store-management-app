import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from "../features/auth/RequireAuth";

const RequireAuth = ({ allowedRoles}) => {
    const { role } = useAuth();

    if(!role) return <Navigate to='/login' replace />;

    if(allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to='/unauthroized' replace />;
    }

    return <Outlet/>;
};

export default RequireAuth;