import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React, { useEffect } from "react";

const RequireAuth = () => {
    const { auth } = useAuth();
    // const { setAuth } = useAuth();
    const location = useLocation();

    // useEffect(() => {
    //     const user = localStorage.getItem('username')
    //     console.log("Loading in require auth: ", user)
    //     setAuth({ "user": user }) // this has no effect when switching pages. 
    //     console.log("Auth before: ", auth)
    //     console.log("Auth user before: ", auth.user)
    // }, [])

    // console.log("Auth user: ", auth.user)
    return (
        auth?.user
            ? <Outlet />
            : <Navigate to="/log_in" state={{ from: location }} replace />
    );
}

export default RequireAuth;