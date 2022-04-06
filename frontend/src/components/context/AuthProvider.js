import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../../axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ user: localStorage.user ? JSON.parse(localStorage.getItem('user')) : {} });

    useEffect(() => {
        axiosInstance.get('/get_current_user/')
            .then(response => {
                const user = response.data;
                setAuth({ user: user })
            }).catch(error => {
                setAuth({ user: {} })
            })
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;