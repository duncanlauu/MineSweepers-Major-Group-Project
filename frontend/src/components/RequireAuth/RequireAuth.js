import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    // console.log("require auth called ")
    return (
        auth?.user
            ? <Outlet />
            : <Navigate to="/log_in" state={{ from: location }} replace />
    );
}

export default RequireAuth;