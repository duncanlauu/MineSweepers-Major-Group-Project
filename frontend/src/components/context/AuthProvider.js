import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => { // children are the components nested inside the auth provider
    const [auth, setAuth] = useState({ user: localStorage.getItem('username') });

    useEffect(() => {
        const user = localStorage.getItem('username')
        setAuth({ user: user })
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;