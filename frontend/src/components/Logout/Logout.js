import React, {useEffect} from 'react';
import axiosInstance from '../../axios';
import {useNavigate} from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const response = axiosInstance.post('user/log_out/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.removeItem('access_token'); // remove the tokens from local storage
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        axiosInstance.defaults.headers['Authorization'] = null; // remove the headers
        navigate('/')
    });

    return <div>Logout</div>;
}