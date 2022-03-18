import React, { useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Logout() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const response = axiosInstance.post('user/log_out/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.removeItem('access_token'); // remove the tokens from local storage
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        setAuth({})
        console.log("logging out")
        // console.log("Auth user after logging out ", auth.user)
        axiosInstance.defaults.headers['Authorization'] = null; // remove the headers
        navigate('/')
    });

    return <div>Logout</div>;
}