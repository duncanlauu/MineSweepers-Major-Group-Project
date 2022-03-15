import React, { createContext, useLayoutEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => { // children are the components nested inside the auth provider
    const [auth, setAuth] = useState({});

    useLayoutEffect(() => {
        const user = localStorage.getItem('username')
        console.log("Reloading authprovider: ", localStorage.getItem('username'))
        setAuth({ user })
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;