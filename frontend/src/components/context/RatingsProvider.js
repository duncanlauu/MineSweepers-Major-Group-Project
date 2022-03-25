import React, { createContext, useEffect, useState } from "react";

const RatingsContext = createContext({});

export const RatingsProvider = ({ children }) => {
    const [hasRated, setHasRated] = useState({ hasRated: localStorage.getItem('hasRated') });

    useEffect(() => {
        const rated = localStorage.getItem('hasRated')
        setHasRated({ hasRated: rated })
    }, [])

    return (
        <RatingsContext.Provider value={{ hasRated, setHasRated }}>
            {children}
        </RatingsContext.Provider>
    )
}

export default RatingsContext