import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log("require auth: ", auth.user)
    auth?.user !== {}
        ? console.log("logged in")
        : console.log("not logged in")
    return (
        auth?.user !== {}
            ? <Outlet />
            : <Navigate to="/log_in" state={{ from: location }} replace />
    );
}

export default RequireAuth;