import React, {createContext, useEffect, useState} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => { // children are the components nested inside the auth provider
    const [auth, setAuth] = useState({user: localStorage.user ? JSON.parse(localStorage.getItem('user')) : {}});

    useEffect(() => {
        const user = localStorage.user ? JSON.parse(localStorage.getItem('user')) : {}
        setAuth({user: user})
    }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;