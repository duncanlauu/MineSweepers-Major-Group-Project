import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";

// Redirect user to home page if they are already logged in

const RequireNotLoggedIn = () => {
    const { auth } = useAuth();
    return (
        auth.user.id
            ? <Navigate to="/home" />
            : <Outlet />
    );
}

export default RequireNotLoggedIn;