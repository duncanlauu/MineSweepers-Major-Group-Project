import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";

// Redirect user to home page if they are already logged in

const RequireNotLoggedIn = () => {
    const { auth } = useAuth();
    // const location = useLocation();
    console.log("require not logged in auth", auth);
    console.log("require not logged in auth", auth?.user);
    console.log(auth.user.id)
    // if (exists(auth.user.id)) {
    //     console.log("logged in")
    // } else {
    //     console.log("not logged in")
    // }
    // auth?.user
    //     ? console.log("true / logged in")
    //     : console.log("false / not logged in")

    return (
        auth.user.id
            ? <Navigate to="/home" />
            : <Outlet />
    );
}

export default RequireNotLoggedIn;