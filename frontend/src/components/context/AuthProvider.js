import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => { // children are the components nested inside the auth provider
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;