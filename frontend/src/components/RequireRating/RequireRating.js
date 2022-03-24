import { useLocation, Navigate, Outlet } from "react-router-dom";
import useHasRated from "../hooks/useHasRated";
import React from "react";

const RequireRatings = () => {
    const { hasRated } = useHasRated();
    const location = useLocation();
    console.log("has rated: ", hasRated)
    return (
        hasRated?.hasRated == "true"
            ? <Outlet />
            : <Navigate to="/sign_up/rating" state={{ from: location }} replace />
    );
}

export default RequireRatings;