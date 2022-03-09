import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        // auth?.roles?.find(role => allowedRoles?.includes(role))
        //     ? <Outlet />
        //     : auth?.username
        //         ? <Navigate to="/error" state={{ from: location }} replace />
        //         : <Navigate to="/log_in" state={{ from: location }} replace />
        auth?.user
            ? <Outlet />
            : <Navigate to="/log_in" state={{ from: location }} replace />
    );
}

export default RequireAuth;